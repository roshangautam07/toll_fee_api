import { apiResponse } from "../dto/response/apiResponse.js"
import { SUCCESS } from "../helpers/constants/responseStatusCode.js"
import { currentNepaliDate, currentNepaliDateWwithTime } from "../helpers/date.js";
import { countTodayCollectedBill, getBillList, getTodaysTotalAmountReceived } from "../services/billing.js";
import { getMyBranchBillingCategory } from "../services/billingCategory.js";
import { getMyBranch } from "../services/branch.js"

export const dashboardData = (req, res, next) => {
    const { id } = req.user;
    console.log(currentNepaliDateWwithTime());
  
    try {
      const executeDashboardData = async () => {
        const [naka, billingCategory, todayCollectedBills, todayCollectedAmount] = await Promise.all([
            getMyBranch(id),
            getMyBranchBillingCategory(id),
            countTodayCollectedBill(id),
            getTodaysTotalAmountReceived(id)
        ]);
  
        const category = {
          billingCategory,
          naka: naka?.branch_title,
          totalBillGenerated: todayCollectedBills,
          totalCollectedAmount: todayCollectedAmount,
        };
  
        return apiResponse(res, SUCCESS, "Success", null, category);
      };
  
      return executeDashboardData();
    } catch (error) {
      next(error);
    }
  };
  