"use server";

import mongoose, { Schema } from "mongoose";
import startDb from "./db";

// User Model
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Budget Model
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
      default: 100000,
    },
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "monthly",
    },
  },
  { timestamps: true }
);

// Expense Model
const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// This function ensures we're connected to the database before accessing models
export async function getModels() {
  await startDb();

  // Now that we're connected, we can safely access mongoose.models
  const User = mongoose.models.User || mongoose.model("User", userSchema);
  const Budget =
    mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
  const Expense =
    mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

  return { User, Budget, Expense };
}
