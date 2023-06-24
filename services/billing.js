import { currentNepaliDate } from "../helpers/date.js";
import BillingDetails from "../models/billingDetails.js";
import db from "../models/index.js";
import { getCurrentFiscalYear } from "./fiscalYear.js";
const { sequelize,QueryTypes,Sequelize } = db;

export async function countTodayCollectedBill(id) {
    const todayNepaliDate = currentNepaliDate();
    const noOfBill = await db.Billing.count({
        where: {
            user_id: id,
            date_np: todayNepaliDate
        }
    });
    return noOfBill;
}

export async function getTodaysTotalAmountReceived(id) {
   const data = await sequelize.query(`select
	sum(IF(bill_returns.id is Null, billing.tender_amount, billing.tender_amount - bill_returns.tender_amount)) as amount
from
	  billing  
left join   bill_returns   on
	  bill_returns.billing_id  = billing.id  
where
	  billing.user_id = ${id}
	and   billing.date_np = '${currentNepaliDate()}'`);
    return data[0][0].amount;
}

export async function getBillList(id, search_query, limit, offset) {
    const fiscalYear = await getCurrentFiscalYear();
    let where = {};
    if (search_query && search_query != '') {
        where = {
            serial_no:search_query
        }
    } else {
        where = {
            fiscal_year: fiscalYear?.id,
            user_id:id
        }
    }
    const billing = await db.Billing.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
        attributes: ['id', 'vehicle_no', 'tender_amount', 'payment_mode', 'date_np', 'total', 'serial_no',
        [Sequelize.fn('DATE_FORMAT',Sequelize.col('billing.created_at'),'%Y/%c/%e %h:%i:%s %p'),'createdAt']],
        where: where,
        include: [{
            model: db.BillingDetails,
            attributes: ['billing_amount'],
            include: [{
                model: db.BillingCategory,
                attributes: [['title', 'vehicleType']],
                // require:true
            }]

        }]
    });
    return billing
    
}

export async function getSingleBillDetails(id) {
    const billingInfo = await db.Billing.findOne({
        where: {
            id: id
        },
        attributes:['id','serial_no','total','gross_amount','vehicle_no','tender_amount'],
        include: [{
            model: db.BillReturn,
            attributes: [['id', 'is_cancelled']]
        }]
    });
    const billingDetails = await db.BillingDetails.findAll({
        where: {
            billing_id: id,
        },
            include: {
                model: db.BillingCategory,
                attributes: ['title',]
            }
        
    })
    return {billingInfo,billingDetails};
}