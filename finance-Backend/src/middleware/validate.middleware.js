
import Joi from "joi";
import { errorResponse } from "../utils/apiResponse.js";


// reusable schemas — define once, use in any route
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),


    // role can be set at registration but defaults to viewer if not provided
    role: Joi.string().valid("viewer", "analyst", "accountant", "admin").optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {

      // collect all validation errors into one readable message
      const message = error.details.map((d) => d.message).join(", ")
      return sendError(res, message, 400)
    }

    next()
  }
}

export{validate, schemas};
