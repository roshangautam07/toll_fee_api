import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';
const env = dotenv.NODE_ENV || 'development';
import dbConfig from '../config/db.js';
const dbs = dbConfig[env];


// create db if it doesn't already exist
//  const { host, port, user, password, database } = dbConfigs.database;
// let sequelize;
// if (dbs.use_env_variable) {
//     sequelize = new Sequelize(dotenv[dbs.use_env_variable], dbs);
// } else {
   let sequelize = new Sequelize(dbs.database, dbs.username, dbs.password, {
        host: dbs.host,
        dialect: dbs.dialect,
       logging: true,
       define: {
        timestamps: false
      },
        dialectOptions: {
            // useUTC: false, //for reading from database
            dateStrings: true,
            typeCast: true
        },
        timezone: '+05:45',
        // pool: {
        //     max: dbConfig.pool.max,
        //     min: dbConfig.pool.min,
        //     acquire: dbConfig.pool.acquire,
        //     idle: dbConfig.pool.idle,
        // },
    });
// }

export default sequelize;