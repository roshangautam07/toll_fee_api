import db from "../models/index.js"

export const getOneUser = async(id)=>{
    const user = await db.Users.findByPk(id);
    return user;
}