export const findByPrimaryKey = async (id, model) => await model.findByPk(id);
export const findOne = async (obj, model) => await model.findOne({ obj });
export const findAll = async (model) => await model.findAll();
export const getSelectedField = async (obj, model) => await findAll({ obj });