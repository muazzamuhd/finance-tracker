import mongoose, { Schema } from "mongoose";

const budgetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      default: 50000,
    },
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "monthly",
    },
  },
  { timestamps: true }
);

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);

export default Budget;
