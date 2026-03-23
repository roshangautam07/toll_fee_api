import db from '../models/index.js';
import { apiResponse } from '../dto/response/apiResponse.js';
import { SUCCESS, UNPROCESSABLE_ENTITY } from '../helpers/constants/responseStatusCode.js';

function parseDefaultValue(rawValue, dataType) {
  if (rawValue === null || rawValue === undefined) return undefined;

  const str = String(rawValue).trim();
  if (str.length === 0) return undefined;

  switch (dataType) {
    case 'number': {
      const num = Number(str);
      return Number.isNaN(num) ? undefined : num;
    }
    case 'boolean': {
      const lower = str.toLowerCase();
      if (lower === 'true' || lower === '1' || lower === 'yes') return true;
      if (lower === 'false' || lower === '0' || lower === 'no') return false;
      return undefined;
    }
    case 'array': {
      try {
        return JSON.parse(str);
      } catch (e) {
        // Fallback for comma-separated values.
        return str.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
    case 'string':
    default:
      return str;
  }
}

function buildFullPathTokens(def) {
  const parent = def?.parentPath && def.parentPath !== 'ROOT' ? String(def.parentPath) : '';
  const full = parent ? `${parent}.${def.keyName}` : String(def.keyName);
  return full.split('.').filter(Boolean);
}

function setValueByTokens(root, tokens, value, instanceIndex) {
  const arrayTokenIndexes = tokens
    .map((t, i) => (t.endsWith('[]') ? i : -1))
    .filter((i) => i >= 0);
  const lastArrayTokenIndex = arrayTokenIndexes.length ? arrayTokenIndexes[arrayTokenIndexes.length - 1] : -1;

  let obj = root;

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const isLast = i === tokens.length - 1;

    if (token.endsWith('[]')) {
      const arrName = token.slice(0, -2);
      if (!Array.isArray(obj[arrName])) obj[arrName] = [];

      const shouldApplyInstance = i === lastArrayTokenIndex;
      const idx = shouldApplyInstance ? (instanceIndex ?? 0) : 0;

      if (isLast) {
        obj[arrName][idx] = value;
      } else {
        if (obj[arrName][idx] === undefined) obj[arrName][idx] = {};
        obj = obj[arrName][idx];
      }

      continue;
    }

    if (isLast) {
      obj[token] = value;
      continue;
    }

    if (obj[token] === undefined || obj[token] === null || typeof obj[token] !== 'object') {
      obj[token] = {};
    }
    obj = obj[token];
  }
}

function buildInitialData(definitions, valuesByDefId) {
  const root = {};

  for (const def of definitions) {
    const vList = valuesByDefId.get(def.id) || [];
    if (!vList.length) continue;

    const tokens = buildFullPathTokens(def);
    const isArrayContext = Boolean(def.isArrayItem) || (def.parentPath ? String(def.parentPath).includes('[]') : false);

    if (isArrayContext) {
      for (const v of vList) {
        const idx = v.instanceIndex ?? 0;
        const parsed = parseDefaultValue(v.defaultValue, def.dataType);
        if (parsed !== undefined) setValueByTokens(root, tokens, parsed, idx);
      }
    } else {
      const v0 = vList.find((v) => (v.instanceIndex ?? 0) === 0) || vList[0];
      const parsed = parseDefaultValue(v0?.defaultValue, def.dataType);
      if (parsed !== undefined) setValueByTokens(root, tokens, parsed, 0);
    }
  }

  return root;
}

export const getDynamicFormTemplate = async (req, res, next) => {
  try {
    const schemeName = req.query?.schemeName;

    if (!schemeName) {
      return apiResponse(res, UNPROCESSABLE_ENTITY, 'Error', 'schemeName is required', null);
    }

    const scopeLevel = req.query?.scopeLevel;

    const [definitions, values] = await Promise.all([
      db.ParameterDefinations.findAll({
        where: scopeLevel ? { scopeLevel } : undefined,
        order: [
          ['displayOrder', 'ASC'],
          ['id', 'ASC'],
        ],
      }),
      db.ParameterValues.findAll({
        where: { schemeName },
      }),
    ]);

    const valuesByDefId = new Map();
    for (const v of values) {
      const arr = valuesByDefId.get(v.paramDefId) || [];
      arr.push(v);
      valuesByDefId.set(v.paramDefId, arr);
    }
    for (const [defId, arr] of valuesByDefId.entries()) {
      arr.sort((a, b) => (a.instanceIndex ?? 0) - (b.instanceIndex ?? 0));
      valuesByDefId.set(defId, arr);
    }

    const fields = definitions.map((def) => {
      const vList = valuesByDefId.get(def.id) || [];
      const isArrayContext = Boolean(def.isArrayItem) || (def.parentPath ? String(def.parentPath).includes('[]') : false);

      const defaultValuesByInstance = {};
      let maxInstanceIndex = -1;

      for (const v of vList) {
        const idx = v.instanceIndex ?? 0;
        const parsed = parseDefaultValue(v.defaultValue, def.dataType);
        defaultValuesByInstance[idx] = parsed;
        maxInstanceIndex = Math.max(maxInstanceIndex, idx);
      }

      const defaultValue = isArrayContext
        ? defaultValuesByInstance[0]
        : parseDefaultValue((vList[0] && vList[0].defaultValue) || undefined, def.dataType);

      const fullPathTokens = buildFullPathTokens(def);
      const fullPath = fullPathTokens.join('.');

      return {
        id: def.id,
        keyLabel: def.keyLabel,
        keyName: def.keyName,
        dataType: def.dataType,
        parentPath: def.parentPath,
        fullPath,
        scopeLevel: def.scopeLevel,
        isArrayItem: def.isArrayItem,
        isCritical: def.isCritical,
        description: def.description,
        defaultValue,
        arrayLength: isArrayContext && maxInstanceIndex >= 0 ? maxInstanceIndex + 1 : undefined,
        // For array context fields, clients can render per item.
        defaultValuesByInstance: isArrayContext ? defaultValuesByInstance : undefined,
      };
    });

    const initialData = buildInitialData(definitions, valuesByDefId);

    return apiResponse(res, SUCCESS, 'Success', null, {
      schemeName,
      fields,
      initialData,
    });
  } catch (error) {
    return next(error);
  }
};

