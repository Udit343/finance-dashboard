
import express from "express";
import { getDashboard, getSummaryOnly } from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router=express.Router();

router.use(protect);


router.get("/summary", getSummaryOnly)
router.get("/", requireRole("analyst"), getDashboard)

export default router;