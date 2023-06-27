import { currentNepaliDate } from "../helpers/date.js";
import db from "../models/index.js"
import { findBillById } from "./billing.js";


const findBillReturnById = async(id) => await db.BillReturn.findByPk(id);

export async function returnBill(data) {
    console.log(data);
    const returns = await db.BillReturn.max('crn');
    const crn = returns ? returns + 1 : 1;
    const bill = await findBillById(data?.billing_id);
    if (!bill) {
        throw new Error('Bill not found');
    }
    const billReturn = await findBillReturnById(data?.billing_id);
    if (billReturn) {
        throw new Error('Bill already cancelled');
    }

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

    return payload;
}
