

import express from "express";
import{getAllRecords,getRecordById,createRecord,updateRecord,
    deleteRecord,getDeletedRecords,restoreRecord,} from "../controllers/record.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { requireRole,adminOnly } from "../middleware/role.middleware.js";
import { validate,schemas } from "../middleware/validate.middleware.js";


const router=express.Router();


// all record routes require login
router.use(protect);



// admin only special routes  defined before /:id to avoid conflicts
router.get("/deleted", adminOnly, getDeletedRecords)
router.patch("/:id/restore", adminOnly, restoreRecord)



// everyone logged in can read
router.get("/", getAllRecords)
router.get("/:id", getRecordById)



// accountant and above can create and edit
router.post("/", requireRole("accountant"), validate(schemas.createRecord), createRecord)
router.put("/:id", requireRole("accountant"), validate(schemas.updateRecord), updateRecord)



// delete  accountant gets soft, admin gets choice of soft or hard
router.delete("/:id", requireRole("accountant"), deleteRecord)

export default router;