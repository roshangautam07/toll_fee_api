
import db from "../models/index.js"
const {ParameterDefinations, ParameterValues} = db;
export const DynamicFormController = {
    // POST /api/setup-template
    setupTemplate: async (req, res) => {
      const templateItems = req.body; // Expecting the array you provided
      const schemeName = req.query.scheme || 'default_scheme';
  
      try {
        const results = await Promise.all(templateItems.map(async (item) => {
          // 1. Ensure the Parameter Definition exists
          const definition = await ParameterDefinations.create({
              keyLabel: item.keyLabel,
              keyName: item.keyName,
              parentPath: item.parentPath,
              paramCategory: item.paramCategory,
              dataType: item.dataType,
              scopeLevel: item.scopeLevel,
              isArrayItem: item.isArrayItem || false,
              isCritical: item.isCritical || false,
              displayOrder: item.displayOrder || 0,
              description: item.description
          });
  
          // 2. Store the actual value in ParameterValues
          // We use upsert so if you call this again, it updates the value instead of erroring
          const valueRecord = await ParameterValues.create({
            paramDefId: definition.id,
            schemeName: schemeName,
            defaultValue: String(item.defaultValue), // Store as text
            instanceIndex: 0 // Defaulting to 0 for non-array items
          });
  
          return { keyName: item.keyName, status: 'synced' };
        }));
  
        res.status(200).json({
          message: "Template and values synchronized successfully",
          processedCount: results.length,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process template input" });
      }
    },
    getAllParameters: async (req, res) => {
        const { scheme } = req.query;
    
        try {
          // 1. Fetch definitions and include their associated values
          const data = await ParameterDefinations.findAll({
            include: [
              {
                model: ParameterValues,
                // as: 'values', // Ensure this alias matches your association setup
                // where: scheme ? { schemeName: scheme } : {}, 
                required: false // true = Inner Join, false = Left Join (shows definitions even if no value exists)
              }
            ],
            order: [
              ['displayOrder', 'ASC'],
              [{ model: ParameterValues, as: 'values' }, 'instanceIndex', 'ASC']
            ]
          });
    // console.log(data[0].dataValues);
          // 2. Format the response to flatten the structure for the UI
        //   const formattedResponse = data.dataValues.map(def => {
        //     const valEntry = def.values && def.values.length > 0 ? def.values[0] : null;
            
        //     return {
        //       id: def.id,
        //       keyLabel: def.keyLabel,
        //       keyName: def.keyName,
        //       parentPath: def.parentPath,
        //       paramCategory: def.paramCategory,
        //       dataType: def.dataType,
        //       isArrayItem: def.isArrayItem,
        //       isCritical: def.isCritical,
        //       displayOrder: def.displayOrder,
        //       description: def.description,
        //       // If it's an array, return all values, otherwise return the first one found
        //       currentValue: def.isArrayItem 
        //         ? def.values.map(v => v.defaultValue) 
        //         : (valEntry ? valEntry.defaultValue : null),
        //       schemeName: valEntry ? valEntry.schemeName : scheme
        //     };
        //   });
    
          res.status(200).json(data);
        } catch (error) {
          console.error("Fetch Error:", error);
          res.status(500).json({ error: "Failed to fetch parameter data" });
        }
      }
  };