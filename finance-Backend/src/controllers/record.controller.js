
import FinancialRecord from "../models/FinancialRecord.model.js";
import { errorResponse,successResponse } from "../utils/apiResponse.js";
import {buildRecordFilter, buildSortOption, buildPagination} from "../utils/queryBuilder.js";


// GET /api/records and viewers, analysts, accountants, admins everyone can read
const getAllRecords = async (req, res, next) => {
  try {
    const filter = buildRecordFilter(req.query)
    const sort = buildSortOption(req.query)
    const { page, limit, skip } = buildPagination(req.query)

    // run count and data fetch in parallel faster than sequential
    const [records, totalCount] = await Promise.all([
      FinancialRecord.find(filter)
        .populate("createdBy", "name email role")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      FinancialRecord.countDocuments(filter),
    ])

    return successResponse(res, {
      records,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    })
  } catch (err) {
    next(err)
  }
}


//GET /api/records/:id
const getRecordById = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findById(req.params.id).populate(
      "createdBy",
      "name email"
    )

    if (!record) return errorResponse(res, "record not found", 404)

    return successResponse(res, { record })
  } catch (err) {
    next(err)
  }
}


// POST /api/records and accountant and admin only
const createRecord = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, notes } = req.body

    const record = await FinancialRecord.create({
      title,
      amount,
      type,
      category,
      date,
      notes,


      // who created it from the verified token
      createdBy: req.user._id,
    })

    return successResponse(res, { record }, "record created", 201);
  } catch (err) {
    next(err)
  }
}



//PUT /api/records/:id and accountant and admin only
const updateRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findById(req.params.id);
    if (!record) return errorResponse(res, "record not found", 404);

    // accountant can only edit their own records and admin can edit anyone
    const isOwner = record.createdBy.toString() === req.user._id.toString()
    const isAdmin = req.user.role === "admin"

    if (!isOwner && !isAdmin) {
      return errorResponse(res, "you can only edit records you created", 403);
    }

    const { title, amount, type, category, date, notes } = req.body

    if (title !== undefined) record.title = title
    if (amount !== undefined) record.amount = amount
    if (type !== undefined) record.type = type
    if (category !== undefined) record.category = category
    if (date !== undefined) record.date = date
    if (notes !== undefined) record.notes = notes

    await record.save();

    return successResponse(res, { record }, "record updated");
  } catch (err) {
    next(err)
  }
}



//DELETE /api/records/:id and  accountant can soft delete only || admin can hard or soft
const deleteRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findById(req.params.id)
    if (!record) return errorResponse(res, "record not found", 404)

    const isOwner = record.createdBy.toString() === req.user._id.toString()
    const isAdmin = req.user.role === "admin"

    if (!isOwner && !isAdmin) {
      return errorResponse(res, "you can only delete records you created", 403)
    }


    if (req.query.hard === "true" && isAdmin) {
      await FinancialRecord.findByIdAndDelete(req.params.id)
      return successResponse(res, null, "record permanently deleted")
    }


    record.isDeleted = true
    record.deletedAt = new Date()
    record.deletedBy = req.user._id
    await record.save()

    return successResponse(res, null, "record deleted")
  } catch (err) {
    next(err)
  }
}




// GET /api/records/deleted and admin only  view soft deleted records
const getDeletedRecords = async (req, res, next) => {
  try {

    const records = await FinancialRecord.find({ isDeleted: true })
      .populate("createdBy", "name email")
      .populate("deletedBy", "name email")
      .sort({ deletedAt: -1 })

    return successResponse(res, { records })
  } catch (err) {
    next(err)
  }
}


// PATCH /api/records/:id/restore and  admin only — undo a soft delete
const restoreRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: true,
    })

    if (!record) return errorResponse(res, "deleted record not found", 404)

    record.isDeleted = false
    record.deletedAt = null
    record.deletedBy = null
    await record.save()

    return successResponse(res, { record }, "record restored")
  } catch (err) {
    next(err)
  }
}



export {getAllRecords, getRecordById, createRecord, updateRecord,  
        deleteRecord, getDeletedRecords, restoreRecord,
}