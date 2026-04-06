
import { errorResponse } from "../utils/apiResponse.js";


// numeric rank makes permission checks a single comparison
// higher number = more access
const roleRank = {
  viewer: 1,
  analyst: 2,
  accountant: 3,
  admin: 4,
}


// returns a middleware function that checks if logged-in user meets the minimum role
// usage requireRole("accountant") that allows accountant and admin, blocks viewer and analyst
const requireRole = (minimumRole) => {
  return (req, res, next) => {
    const userRank = roleRank[req.user.role]
    const neededRank = roleRank[minimumRole]

    if (!userRank || userRank < neededRank) {
      return errorResponse(res, "you do not have permission for this action", 403)
    }

    next()
  }
}


// shorthand for admin-only routes
const adminOnly = requireRole("admin");

export {adminOnly,requireRole};
