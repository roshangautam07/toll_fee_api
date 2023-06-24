import dotenv from 'dotenv';
dotenv.config()
const dbConfig = {
    development: {
        username: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_DATABASE,
        host: process.env.DEV_DB_HOST,
        dialect: 'mysql',
        // logging: dotenv.DEV_DB_LOGGING || true,
        // pool: {
        //     max: 5,
        //     min: 0,
        //     acquire: 30000,
        //     idle: 10000,
        // },
    },
    secret: process.env.ACCESS_TOKEN_SECRATE_KEY || 'SDFJDSFSDFSFSD8F66S5D4FDS54F4DS56F4DSFS46F5',
    refreshTokenSecrate: process.env.REFRESH_TOKEN_SECRATE_KEY || 'D99DFDS9F9DSF6S5D4FDS54F4DS56F9994DSFS46F5',
    accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRY || '1s',
    refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRY || '5h',
    test: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASSWORD,
        database: process.env.TEST_DB_DATABASE,
        host: process.env.TEST_DB_HOST,
        dialect: 'mysql',
        logging: process.env.TEST_DB_LOGGING || true,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: process.env.DB_HOST_LOGGING || false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    maintenance: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASSWORD,
        database: process.env.TEST_DB_DATABASE,
        host: process.env.TEST_DB_HOST,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
};

export default dbConfig;