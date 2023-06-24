import { currentNepaliDateWwithTime } from "../helpers/date.js";
import db from "../models/index.js"
const { Sequelize } = db;
const { Op } = Sequelize;

export const getCurrentFiscalYear = async() => {
    const fiscal = await db.FiscalYear.findOne({
        where: {
            fiscal_year_end: {
                [Op.gte]: currentNepaliDateWwithTime()
            },
            fiscal_year_start: {
                [Op.lte]: currentNepaliDateWwithTime()
            }
        }
    });
    return fiscal;
}