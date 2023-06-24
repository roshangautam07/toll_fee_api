import db from "../models/index.js"
import { getOneUser } from "./users.js";

export const getMyBranch = async (id) => {
    const user = await getOneUser(id);
    const naka = await db.Branch.findOne({
        attributes:['branch_title'],
        where: {
            id:user?.branch_id
            
        }
    });
    return naka;
}