
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { errorResponse,successResponse } from "../utils/apiResponse.js";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}



const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body


    // check duplicate before mongoose throws its own error
    const existing = await User.findOne({ email })
    if (existing) return errorResponse(res, "email already registered", 409)


    const user = await User.create({ name, email, password, role })
    const token = signToken(user._id)


    // never send password back even hashed
    user.password = undefined

    return successResponse(res, { user, token }, "account created", 201)
  } catch (err) {
    next(err)
  }
}




const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // explicitly select password since schema hides it by default
    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await user.isPasswordCorrect(password))) {
      // same message for both cases — don't reveal which one failed
      return errorResponse(res, "email or password is incorrect", 401)
    }

    if (!user.isActive) {
      return errorResponse(res, "your account has been deactivated, contact admin", 403)
    }

    const token = signToken(user._id)
    user.password = undefined

    return successResponse(res, { user, token }, "logged in successfully")
  } catch (err) {
    next(err)
  }
}


// useful for frontend to rehydrate user on page refresh using stored token
const getMe = async (req, res,next) => {
  return successResponse(res, { user: req.user }, "user fetched")
}


export {register,login,getMe};


