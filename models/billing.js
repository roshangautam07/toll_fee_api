
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
            date_np: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            vehicle_no: {
                type: Sequelize.STRING,
                allowNull: false,
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
            tableName: 'billing'
        }
    );
    return Billing;
};
