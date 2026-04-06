
import User from "../models/User.model.js";
import { errorResponse,successResponse } from "../utils/apiResponse.js";

// list all users — admin wants to see everyone
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password")
    return successResponse(res, { users })
  } catch (err) {
    next(err)
  }
}


// toggle active status safer than deleting
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return errorResponse(res, "user not found", 404)

    // prevent admin from locking themselves out
    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, "you cannot deactivate your own account", 400)
    }

    user.isActive = !user.isActive
    await user.save()

    const status = user.isActive ? "activated" : "deactivated"
    return successResponse(res, { user }, `user ${status}`)
  } catch (err) {
    next(err)
  }
}




// change a users role admin only
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body
    const validRoles = ["viewer", "analyst", "accountant", "admin"]

    if (!validRoles.includes(role)) {
      return errorResponse(res, "invalid role provided", 400)
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) return errorResponse(res, "user not found", 404)

    return successResponse(res, { user }, "role updated")
  } catch (err) {
    next(err)
  }
}


export{getAllUsers,toggleUserStatus,updateUserRole};
