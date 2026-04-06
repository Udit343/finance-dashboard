
import CONFIG from "./constants.js";

const buildRecordFilter = (query) => {
  const filter = {}

    // filter by income or expense
  if (query.type && CONFIG.RECORD_TYPES.includes(query.type)) {
    filter.type = query.type
  }


    // filter by category
  if (query.category && CONFIG.CATEGORIES.includes(query.category)) {
    filter.category = query.category
  }

  if (query.startDate || query.endDate) {
    filter.date = {}
    if (query.startDate) filter.date.$gte = new Date(query.startDate)
    if (query.endDate) {

      const end = new Date(query.endDate)
      end.setHours(23, 59, 59, 999)
      filter.date.$lte = end
    }
  }


    // minimum amount filter
  if (query.minAmount) {
    filter.amount = { ...filter.amount, $gte: Number(query.minAmount) }
  }


    // maximum amount filter
  if (query.maxAmount) {
    filter.amount = { ...filter.amount, $lte: Number(query.maxAmount) }
  }

return filter

}



//sort object from query defaults to newest first
const buildSortOption = (query) => {
  const { sortBy = "createdAt", order = "desc" } = query

  if (!CONFIG.ALLOWED_SORT_FIELDS.includes(sortBy)) {
    return { createdAt: -1 }
  }

  return { [sortBy]: order === "asc" ? 1 : -1 }
}

const buildPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || CONFIG.DEFAULT_PAGE)
  const limit = Math.min(
    parseInt(query.limit) || CONFIG.DEFAULT_LIMIT,
    CONFIG.MAX_LIMIT
  )
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export {buildRecordFilter, buildSortOption, buildPagination}