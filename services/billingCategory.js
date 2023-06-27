import db from "../models/index.js"
import { getOneUser } from "./users.js";

export const getMyBranchBillingCategory = async (id) => {
    const user = await getOneUser(id);
    const billingCategory = await db.BillingCategory.findAll({
        attributes: ['id', 'rate', ['title', 'vechile_type'], ['title_np', 'code']],
        where: {
            branch_id: user?.branch_id,
            status:'active'
        }
    });
    return billingCategory

}