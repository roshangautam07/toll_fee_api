import { apiResponse } from "../dto/response/apiResponse.js";
import { billDetail, billingData } from "../dto/response/transformData.js";
import { SUCCESS } from "../helpers/constants/responseStatusCode.js";
import { getPagination, paginate } from "../helpers/pagination.js";
import { getBillList, getSingleBillDetails } from "../services/billing.js";

export const billList = async (req, res, next) => {
    try {
        const { page_no, search_query } = req.query;

        const { limit, offset } = getPagination(page_no, 5);
        const billing = await getBillList(req?.user?.id,search_query, limit, offset);
        const { totalItems, rows, totalPages, currentPage, size } = await paginate(billing, req.query, limit);
        const data = rows.map(d => billingData(d));
        return apiResponse(res, SUCCESS, 'Success', null, { data, totalPage:totalPages,totalItems,size });
    } catch (error) {
        console.log(error)
        next(error);
    }
}

export const billDetails = async (req, res, next) => {
    try {
        if (req.body?.billing_id== null) {
            return apiResponse(res,SUCCESS,'Success',null,null)
        }
    const {billingInfo,billingDetails} = await getSingleBillDetails(req.body?.billing_id);
        return apiResponse(res, SUCCESS, 'Success', null, {
            billingInfo,
            // billingDetails
            billingDetails: billingDetails.map(d => billDetail(d))
        })
    } catch (error) {
        next(error);
    }
}