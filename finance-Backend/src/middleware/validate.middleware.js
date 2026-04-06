
import Joi from "joi";
import { errorResponse } from "../utils/apiResponse.js";
import CONFIG from "../utils/constants.js";

// reusable schemas define once, use in any route
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),


    // role can be set at registration but defaults to viewer if not provided
    role: Joi.string().valid(...Object.values(CONFIG.ROLES)).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createRecord: Joi.object({
    title: Joi.string().min(2).max(100).required(),
    amount: Joi.number().positive().required(),
    type: Joi.string()
      .valid(...CONFIG.RECORD_TYPES)
      .required(),
    category: Joi.string()
      .valid(...CONFIG.CATEGORIES)
      .required(),

    date: Joi.date().max("now").required(),
    notes: Joi.string().max(500).allow("").optional(),
  }),

  updateRecord: Joi.object({
    title: Joi.string().min(2).max(100).optional(),
    amount: Joi.number().positive().optional(),
    type: Joi.string()
      .valid(...CONFIG.RECORD_TYPES)
      .optional(),
    category: Joi.string()
      .valid(...CONFIG.CATEGORIES)
      .optional(),
    date: Joi.date().max("now").optional(),
    notes: Joi.string().max(500).allow("").optional(),
  }).min(1),

}

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {

      // collect all validation errors into one readable message
      const message = error.details.map((d) => d.message).join(", ")
      return errorResponse(res, message, 400)
    }

    next()
  }
}

export{validate, schemas};
