
import mongoose from "mongoose";
import CONFIG from "../utils/constants.js";

const financialRecordSchema=new mongoose.Schema({
      
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      minlength: [2, "title must be at least 2 characters"],
      maxlength: [100, "title cannot exceed 100 characters"],
    },

    amount: {
      type: Number,
      required: [true, "amount is required"],
      // amount must always be positive type field handles income vs expense
      min: [0.01, "amount must be greater than 0"],
    },

    type: {
      type: String,
      enum: {
        values: CONFIG.RECORD_TYPES,
        message: "type must be income or expense",
      },
      required: [true, "type is required"],
    },

    category: {
      type: String,
      enum: {
        values: CONFIG.CATEGORIES,
        message: "invalid category",
      },
      required: [true, "category is required"],
    },


    // storing date separately from createdAt
    // because user might enter a past transaction
    date: {
      type: Date,
      required: [true, "date is required"],
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "notes cannot exceed 500 characters"],
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
},
  {
    timestamps: true,
  }
)

financialRecordSchema.pre(/^find/, function (next) {
  // if query already sets isDeleted (admin viewing deleted) — skip this filter
  if (this._conditions.isDeleted === undefined) {
    this.where({ isDeleted: false })
  }
})

financialRecordSchema.index({ date: -1 })
financialRecordSchema.index({ type: 1, category: 1 })
financialRecordSchema.index({ createdBy: 1 })

export default mongoose.model("FinancialRecord",financialRecordSchema);