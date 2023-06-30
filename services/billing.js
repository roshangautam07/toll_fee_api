import { currentNepaliDate, currentNepaliDateWwithTime } from "../helpers/date.js";
import BillingDetails from "../models/billingDetails.js";
import db from "../models/index.js";
import { getCurrentFiscalYear } from "./fiscalYear.js";
import { getOneUser } from "./users.js";
const { sequelize, QueryTypes, Sequelize } = db;

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
export const findBillById = async (id) => await db.Billing.findByPk(id);
export const findBillingDetailsById = async (id) => await db.BillingDetails.findOne({ where: { billing_id: id } });

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
            serial_no: search_query
        }
    } else {
        where = {
            fiscal_year: fiscalYear?.id,
            user_id: id
        }
    }
    const billing = await db.Billing.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
        attributes: ['id', 'vehicle_no', 'tender_amount', 'payment_mode', 'date_np', 'total', 'serial_no',
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('billing.created_at'), '%Y/%c/%e %h:%i:%s %p'), 'createdAt']],
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
        raw: true,
        // nest: true,
        attributes: ['id', 'serial_no', 'total', 'gross_amount', 'vehicle_no', 'tender_amount'],
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
    return { billingInfo, billingDetails };
}

async function getBillingById(id) {
    const billings = await db.Billing.findByPk(id);
    return currentNepaliDateWwithTime(billings?.created_at)
}

async function retriveCreatedBill(id) {
    const bill = await sequelize.query(`select
	billing.id,
	billing.date_np,
	billing.vehicle_no,
	billing.gross_amount,
	billing.total,
	billing.payment_mode,
	billing.serial_no,
	users.name as billing_by,
	branches.branch_title as road_section,
    collection_center.name as collection_center
from
	billing
inner join users on
	users.id = billing.user_id
inner join branches on
	branches.id = billing.branch_id
    inner join collection_center on
	collection_center.id = billing.collection_center_id
where
	billing.id =${id}`);
    return bill;
}

async function retriveCreatedBillingDetails(id) {
    const bill = await sequelize.query(`select
	billing_categories.title,
	billing_details.billing_amount,
	billing_details.quantity,
	billing_details.billing_amount
from
	billing_details
inner join billing_categories on
	billing_categories.id = billing_details.billing_category_id
where
	billing_id = ${id}`);
    return bill;
}
export async function storeBill(data, id) {
    const { billingCategory ={} } = data;
    let transaction = await sequelize.transaction();
    try {
        const maxBilling = await db.Billing.max('id');
        console.log('MSX',maxBilling)
        const user = await getOneUser(id);
        const fiscalYear = await getCurrentFiscalYear();
        if (data.billingCategory.length < 0) {
            new Error('Invalid request')
        }
        const billingCategories = await db.BillingCategory.findOne({
            attributes: ['rate'],
            where: {
                id: billingCategory[0]?.billing_category_id,
                status: 'active',
                branch_id: user?.branch_id,
                
            }
        });
        if (billingCategories?.length < 0) {
            new Error('Invalid request')
        }
        const payload = {
            user_id: id,
            branch_id: user?.branch_id,
            serial_no: maxBilling ? maxBilling + 1:1,
            date_np: currentNepaliDate(),
            fiscal_year: fiscalYear?.id,
            customer_id: 1,
            goods_receiver: 'none',
            payment_mode: data.payment_mode,
            gross_amount: billingCategories?.rate,
            tender_amount: billingCategories?.rate,
            total: billingCategories?.rate,
            vat_amount: 0,
            vehicle_no: data.vehicle_no,
            collection_center_id:user?.collection_center_id
        }

        const {billing_amount,...rest} = data.billingCategory[0];
        const bill = await db.Billing.create(payload);
        bill.createBilling_detail({...rest,billing_amount:billingCategories?.rate});
        await transaction.commit();
        const billing_details = await retriveCreatedBill(bill?.id);
        const bill_information = await retriveCreatedBillingDetails(bill?.id)
        return {
            bill_information: bill_information[0][0],
            billing_details: billing_details[0][0],
            issued_date:await getBillingById(bill?.id)
        };
    } catch (error) {
        await transaction.rollback();
        throw error

    }

}