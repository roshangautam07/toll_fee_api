import { currentNepaliDate } from "../helpers/date.js";
import db from "../models/index.js"
import { findBillById, findBillingDetailsById } from "./billing.js";
const { sequelize, QueryTypes, Sequelize } = db;


const findBillReturnById = async (id) => await db.BillReturn.findByPk(id);
const findBillReturnByBillingId = async(id) => await db.BillReturn.findOne({where:{billing_id:id}})

const responseQuery = async (id) => {
    const data = await sequelize.query(`select
    billing .*,
    bill_returns.id as is_cancelled
    from
    billing
    inner join bill_returns on
    bill_returns.billing_id = billing.id
    where
    billing.id =${id}`);
    return data;
};

export async function returnBill(data) {
    let transaction = await sequelize.transaction();
    try {
        console.log(data);
        const returns = await db.BillReturn.max('crn');
        const crn = returns ? returns + 1 : 1;
        const bill = await findBillById(data?.billing_id);
        if (!bill) {
            throw new Error('Bill not found');
        }
        const billReturn = await findBillReturnById(data?.billing_id);
        const isReturned = await findBillReturnByBillingId(data?.billing_id);
        if (isReturned) {
            throw new Error('Bill already cancelled');
        }

        const billDetails = await findBillingDetailsById(bill?.id);


        const payload = {
            billing_id: bill?.id,
            serial_no: bill?.serial_no,
            customer_id: bill?.customer_id,
            user_id: bill?.user_id,
            branch_id: bill?.branch_id,
            date_np: currentNepaliDate(),
            vehicle_no: bill?.vehicle_no,
            goods_receiver: bill?.goods_receiver,
            gross_amount: bill?.gross_amount,
            vat_amount: bill?.gross_amount,
            total: bill?.total,
            tender_amount: bill?.tender_amount,
            due_amount: bill?.due_amount,
            fiscal_year: bill?.fiscal_year,
            crn: crn,
            credit_note: data?.credit_note
        }
        const rbill = await db.BillReturn.create(payload);
        const detailsPayload = {
            billing_return_id: rbill?.id,
            billing_id: bill?.id,
            billing_category_id: billDetails?.billing_category_id,
            quantity: billDetails?.quantity,
            billing_amount: billDetails?.billing_amount
        };
        rbill.createBill_return_detail(detailsPayload)
        // const res = await responseQuery(rbill.id);
        // console.log(res)
        await transaction.commit();

        // await transaction.rollback();
        return {is_cancelled:bill?.tender_amount};

    } catch (error) {
        await transaction.rollback();
        throw error
    }


}
