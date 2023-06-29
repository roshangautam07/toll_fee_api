
import bcrypt from 'bcryptjs';
// const User = Db.user;
/* eslint-disable camelcase */
export default function Users(sequelize, Sequelize) {
    const User = sequelize.define(
        'users',
        {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'name is required',
                    },
                    notEmpty: {
                        msg: 'name is required',
                    },
                },
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: {
                        msg: 'Email address must be valid.',
                    },
                    notNull: {
                        msg: 'Email is required',
                    },
                    notEmpty: {
                        msg: 'Email is required',
                    },
                    isUnique(value) {
                        return User.findOne({ where: { email: value } }).then((email) => {
                            if (email) {
                                throw new Error('Email already exist');
                            }
                        });
                    },
                },
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Password is required',
                    },
                    notEmpty: {
                        msg: 'Password is required',
                    },
                    checkLength(value) {
                        const val = String(value);
                        if (val.length < 8) {
                            throw new Error('Password lenght must be atleast 8 digit');

                        }
                    }
                    // len: {
                    //   args: [8, 16],
                    //   msg: 'Password length must be 8 digit min or 16 max'
                    // }
                },
            },
            confirmPassword: {
                type: Sequelize.VIRTUAL,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Confirm password is required',
                    },
                    check(val) {
                        if (val !== this.password) {
                            throw new Error('Confirm password not match');
                        }

                        const hashPassword = bcrypt(val.toString(), 10);
                        this.setDataValue('password', hashPassword);
                    },
                    // len: {
                    //   args: [8, 16],
                    //   msg: 'Password length must be 8 digit min or 16 max'
                    // }
                },
            },
            branch_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            collection_center_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            user_type: {
                type: Sequelize.ENUM,
                allowNull: false,
                values: [
                    'super admin',
                    'collector'
                ],
                defaultValue: 'active',
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
            counter: {
                type: Sequelize.ENUM,
                values: [
                    'Counter 1',
                    'Counter 1'
                ],
                defaultValue: 'Counter 1',
            },
            created_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            logged_in_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            }
        },
        {
            defaultScope: {
                // exclude password hash by default
                attributes: { exclude: ['password', 'updatedAt'] },
            },
            scopes: {
                // include hash with this scope
                withHash: { attributes: {} },
            },
        }
    );
    User.prototype.testMethod = function () {
        console.log('This is an instance method log');
    };
    return User;
};
