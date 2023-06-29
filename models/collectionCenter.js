
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function CollectionCenter(sequelize, Sequelize) {
    const Branch = sequelize.define(
        'collection_center',
        {
            name: {
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
            created_by: {
                type: Sequelize.INTEGER,
                allowNull:false,
                references: {
                    model: 'users',
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
            created_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },{
            freezeTableName: true,
            // define the table's name
            tableName: 'collection_center'
        }
    );
    return Branch;
};
