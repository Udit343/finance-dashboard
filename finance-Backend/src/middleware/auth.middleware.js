
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import {errorResponse} from "../utils/apiResponse.js";

// checks if the request has a valid jwt token


const protect = async(req, res, next)=>{

      try{

        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return errorResponse(res, "please login to access this", 401)
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // fetch fresh user — token could be valid but account deactivated since then
        const user = await User.findById(decoded.id)


        if (!user) return errorResponse(res, "user no longer exists", 401)
        if (!user.isActive) return errorResponse(res, "account has been deactivated", 403)
        req.user = user

        next();

      }catch(err){
        next(err);
      }
}

export {protect};