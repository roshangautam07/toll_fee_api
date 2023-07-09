import db from "../models/index.js"

export const saveFileInfo = async(data) => {
    const file = await db.AppDeployment.create(data);
    return file;
}

export const getLastDeployment = async()=>{
    const apk = await db.AppDeployment.findOne({
        attributes: [
            'id','app_name','versionCode','versionName','package','remarks','is_force_update',
            // db.sequelize.fn('MAX', db.sequelize.col('id'))
        ],
        //group:['id']
        order: [['id','DESC']],
        limit:1
    });
    return apk;
}