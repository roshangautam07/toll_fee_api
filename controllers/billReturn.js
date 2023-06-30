import { apiResponse } from "../dto/response/apiResponse.js";
import { SUCCESS } from "../helpers/constants/responseStatusCode.js";
import { returnBill } from "../services/billReturn.js";

export function billReturn(req, res, next) {
    returnBill(req.body,req.user.id).then((response) => {
        return apiResponse(res, SUCCESS, 'Success', null, response);
    }).catch(next)
}