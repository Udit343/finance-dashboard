
import {getSummary, getCategoryBreakdown,getMonthlyTrends,getRecentActivity} from "../services/dashboard.service.js";
import { successResponse } from "../utils/apiResponse.js";



// returns everything in one call  frontend loads dashboard in one request
const getDashboard = async (req, res, next) => {
  try {
    // run all queries at same time — no point waiting for one to finish before starting next
    const [summary, categoryBreakdown, monthlyTrends, recentActivity] =
      await Promise.all([
        getSummary(),
        getCategoryBreakdown(),
        getMonthlyTrends(),
        getRecentActivity(),
      ])

    return successResponse(res, {
      summary,
      categoryBreakdown,
      monthlyTrends,
      recentActivity,
    })
    } catch (err) {
    next(err)
  }
}



//lightweight, for header stats
const getSummaryOnly = async (req, res, next) => {
  try {
    const summary = await getSummary()
    return successResponse(res, { summary })
  } catch (err) {
    next(err)
  }
}


export {getDashboard, getSummaryOnly};