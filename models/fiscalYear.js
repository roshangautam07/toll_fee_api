
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function Users(sequelize, Sequelize) {
    const FiscalYear = sequelize.define(
        'fiscal_year',
        {
            fiscal_year_start: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            fiscal_year_end: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            fiscal_year: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            
        },
        {
            freezeTableName: true,
            // define the table's name
            tableName: 'fiscal_year'
        }
    );
    return FiscalYear;
};
