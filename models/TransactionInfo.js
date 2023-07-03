
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function TransactionInfo(sequelize, Sequelize) {
    const TransactionInfo = sequelize.define(
        'transaction_info',
        {
            billing_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'billing',
                    key: 'id',
                },
            },
            traceId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            transactionDate: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            amount: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            message: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            success: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            commissionType: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            commissionAmount: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            totalCalculatedAmount: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            paymentSuccess: {
                type: Sequelize.STRING,
                allowNull: true,
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
            tableName: 'transaction_info'
        }
    );
    return TransactionInfo;
};
