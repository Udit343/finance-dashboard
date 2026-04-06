
import express from "express";

import { getAllUsers ,toggleUserStatus, updateUserRole} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router()

router.use(protect, adminOnly)

router.get("/", getAllUsers)
router.patch("/:id/status", toggleUserStatus)
router.patch("/:id/role", updateUserRole)

export default router;