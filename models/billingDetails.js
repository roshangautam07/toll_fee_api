
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function BillingDetails(sequelize, Sequelize) {
    const BillingDetails = sequelize.define(
        'billing_details',
        {
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
                type: Sequelize.DOUBLE,
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
            tableName: 'billing_details'
        }
    );
    return BillingDetails;
};
