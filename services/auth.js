import { compare } from '../helpers/bcrypt.js';
import { customError } from '../helpers/customError.js';
import db from '../models/index.js';
import {FORBIDDEN} from '../helpers/constants/responseStatusCode.js'
import { generateJwtToken } from '../helpers/jwt.js';
export const authenticate = async ({ email, password }) => {
    try {
        const user = await db.Users.scope('withHash').findOne({
            where: {
                email: email,
                user_type: 'collector',
            },
        });
        console.log('use',user)
    
        if (!user || !(await compare(password, user.password))) {
            throw customError(FORBIDDEN, 'User credential is incorrect');
        }
        if (user.status == 'inactive') {
            throw customError(FORBIDDEN, 'User account is disabled');
        }
        const accessToken = generateJwtToken(user);
        return {
            status: 'Success',
            message: null,
            data: {
                token:accessToken
            }
        }

    } catch (err) {
        throw err;
    }
}