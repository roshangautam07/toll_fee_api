
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function BillingCategory(sequelize, Sequelize) {
    const BillingCategory = sequelize.define(
        'billing_categories',
        {
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            title_np: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            branch_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'branches',
                    key: 'id',
                },
            },
            fiscal_year: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'fiscal_year',
                    key: 'id',
                },
            },
            status: {
                type: Sequelize.ENUM,
                values: [
                    'active',
                    'inactive'
                ],
                defaultValue: 'active',
                allowNull: false,
            },
            rate: {
                type: Sequelize.DOUBLE(8,2),
                allowNull:false
            },
            created_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            }
        }
    );
    return BillingCategory;
};
