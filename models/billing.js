
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function Billing(sequelize, Sequelize) {
    const Billing = sequelize.define(
        'billing',
        {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            branch_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            customer_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            fiscal_year: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            date_np: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            goods_receiver: {
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
            vehicle_no: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            serial_no: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            payment_mode: {
                type: Sequelize.ENUM,
                values: [
                    'cash',
                    'fonepay'
                ],
                defaultValue: 'cash',
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
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
            tableName: 'billing'
        }
    );
    return Billing;
};
