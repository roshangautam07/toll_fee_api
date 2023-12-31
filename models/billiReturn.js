
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function BillReturn(sequelize, Sequelize) {
    const BillReturn = sequelize.define(
        'bill_returns',
        {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            billing_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'billing',
                    key: 'id',
                },
            },
            branch_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'branches',
                    key: 'id',
                },
            },
            customer_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            date_np: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            gross_amount: {
                type: Sequelize.DOUBLE(8,2),
                allowNull: false,
            },
            tender_amount: {
                type: Sequelize.DOUBLE(8,2),
                allowNull: false,
            },
            vat_amount: {
                type: Sequelize.DOUBLE(8,2),
                allowNull: true,
            },
            total: {
                type: Sequelize.DOUBLE(8,2),
                allowNull: true,
            },
            goods_receiver: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            fiscal_year: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            serial_no: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
        {
            freezeTableName: true,
            // define the table's name
            tableName: 'bill_returns'
        }
    );
    return BillReturn;
};
