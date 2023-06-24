import dbConfig from "../config/db.js";
import Jwt from 'jsonwebtoken';

export   function generateJwtToken(user) {
    // create a jwt token containing the account id that expires in 15 minutes
    return Jwt.sign(
      {
        id: user.id,
        sub:user.id,
      },
      dbConfig.secret,
      { expiresIn: dbConfig.accessTokenExpire }
    );
}
  
export function verifyAccessToken(token) {
  // return Jwt.verify(token, dbConfig.secret, (err, decode) => {
  //   new Promise((resolve, reject) => {
  //     if (!err) {
  //       return resolve(decode);
  //     } else {
  //       return reject(err);
  //     }
  //   });
  // });
  try {
    const jwt = Jwt.decode(token, dbConfig.secret);
    return jwt ;
  } catch (error) {
    throw error;
  }
}
