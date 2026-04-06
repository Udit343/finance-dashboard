
import FinancialRecord from "../models/FinancialRecord.model.js";



// total income, total expense, net balance
const getSummary = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ])

  const income = result.find((r) => r._id === "income")
  const expense = result.find((r) => r._id === "expense")

  const totalIncome = income?.total || 0
  const totalExpense = expense?.total || 0
  

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    totalRecords: (income?.count || 0) + (expense?.count || 0),
  }
}



// totals grouped by category
const getCategoryBreakdown = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ])

  return result.map((item) => ({
    category: item._id.category,
    type: item._id.type,
    total: item.total,
    count: item.count,
  }))
}



// monthly totals for the past used for trend chart
const getMonthlyTrends = async () => {
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
  twelveMonthsAgo.setDate(1)
  twelveMonthsAgo.setHours(0, 0, 0, 0)

  const result = await FinancialRecord.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ])

  return result.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    type: item._id.type,
    total: item.total,
  }))
}

//most recent records for activity feed on dashboard
const getRecentActivity = async (limit = 5) => {
  return await FinancialRecord.find({ isDeleted: false })
    .populate("createdBy", "name")
    .sort({ createdAt: -1 })
    .limit(limit)
}

export {getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity};