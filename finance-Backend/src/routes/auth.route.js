
import express from "express";
import { register,login,getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate,schemas } from "../middleware/validate.middleware.js";


const router = express.Router()

router.post("/register",validate(schemas.register),register);
router.post("/login", validate(schemas.login), login)

// protected — must be logged in
router.get("/me", protect, getMe)

export default router;

