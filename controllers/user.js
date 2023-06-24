
import { apiResponse } from "../dto/response/apiResponse.js";
import { SUCCESS } from "../helpers/constants/responseStatusCode.js";
import { getOneUser } from "../services/users.js"

export const getUser = async (req, res, next) => {
    console.log(req.user)
    getOneUser(req.user.id).then(response => {
       return apiResponse(res,SUCCESS,'Success',null,[response])
    }).catch(er => {
        console.log(er);
        res.json(er);
    });
   
}