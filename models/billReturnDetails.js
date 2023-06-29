
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function BillReturnDetails(sequelize, Sequelize) {
    const BillReturnDetails = sequelize.define(
        'bill_return_details',
        {
            billing_return_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'bill_returns',
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
            billing_category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'billing_categories',
                    key: 'id',
                },
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            billing_amount: {
                type: Sequelize.DOUBLE(8,2),
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
            tableName: 'bill_return_details'
        }
    );
    return BillReturnDetails;
};
