
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function AppDeployment(sequelize, Sequelize) {
    const AppDeployment = sequelize.define(
        'app_deployments',
        {
            app_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            versionCode: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            versionName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            compileSdkVersion: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            compileSdkVersionCodename: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            package: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            platformBuildVersionCode: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            platformBuildVersionName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            remarks: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            is_force_update: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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
            tableName: 'app_deployments'
        }
    );
    return AppDeployment;
};
