
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function BillingExtraDetails(sequelize, Sequelize) {
    const BillingExtraDetails = sequelize.define(
        'bill_extra_details',
        {
            billing_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'billing',
                    key: 'id',
                },
            },
            printcount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            ird_status: {
                type: Sequelize.ENUM,
                values: [
                    'synced',
                    'unsynced'
                ],
                defaultValue: 'unsynced',
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
            tableName: 'bill_extra_details'
        }
    );
    return BillingExtraDetails;
};
