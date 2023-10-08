
// const User = Db.user;
/* eslint-disable camelcase */
export default function DeviceInformation(sequelize, Sequelize) {
    const DeviceInformation = sequelize.define(
        'device_informations',
        {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            android_version: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            serial_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.STRING,
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
            tableName: 'device_informations'
        }
    );
    return DeviceInformation;
};
