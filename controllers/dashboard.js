import { apiResponse } from "../dto/response/apiResponse.js"
import { SUCCESS } from "../helpers/constants/responseStatusCode.js"
import { currentNepaliDate, currentNepaliDateWwithTime } from "../helpers/date.js";
import { countTodayCollectedBill, getBillList, getTodaysTotalAmountReceived } from "../services/billing.js";
import { getMyBranchBillingCategory } from "../services/billingCategory.js";
import { getMyBranch } from "../services/branch.js"

export const dashboardData = async (req, res, next) => {
    const { id } = req.user;
    console.log(currentNepaliDateWwithTime())
   try {
       const naka = await getMyBranch(id);
       const billingCategory = await getMyBranchBillingCategory(id);
       const todayCollectedBills = await countTodayCollectedBill(id);
       const todayCollectedAmount = await getTodaysTotalAmountReceived(id);
       const category = {
           billingCategory: billingCategory,
           naka: naka?.branch_title,
           totalBillGenerated: todayCollectedBills,
           totalCollectedAmount: todayCollectedAmount,
       }
       return apiResponse(res,SUCCESS,"Success",null,category)
   } catch (error) {
       console.log(error)
    next(error)
   }
}