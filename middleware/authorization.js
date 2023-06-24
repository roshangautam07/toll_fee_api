import jwt from "express-jwt";
import dbConfig from '../config/db.js';
import { verifyAccessToken } from "../helpers/jwt.js";
import db from '../models/index.js';
const { secret } = dbConfig;
export default authorization;
// async function authorization(req, res, next) {
//     try {
//         const auth = req.headers.authorization;
//         if (!auth) {
//             return res.status(401).json({status:'Error',message:'Token is Invalid',data:null})
//         }
//         const token = req.headers.authorization?.split(' ')[1];
//         if (req.headers?.authorization && req.headers?.authorization?.startsWith("Bearer ")) {
//             const users = verifyAccessToken(token);
//             if (users && Date.now() >= users.exp * 1000) {
//                 return res.status(401).json({status:'Error',message:'Token is Invalid',data:null})
//             }
//             if (users) {
//                 req.user = users;
//                 next();
//             } else {
//                 return res.status(401).json({status:'Error',message:'Token is Invalid',data:null})
//             }
        
//         //     throw err;
//         }
//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }


// }

function authorization(roles = []) {
    if (typeof roles == 'string') {
        roles = [roles];
    }

    return [
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async(req, res, next) => {
            
            try {
               
                
                    next();
            } catch (error) {
                return res.status(ResCode.NOTIMPLEMENTED).json({
                    status: ResCode.NOTIMPLEMENTED,
                    error: error.toString(),
                });
            }
        },
    ];
}