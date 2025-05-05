"use server";

import mongoose from "mongoose";

// This prevents multiple connections in development
let isConnected = false;

const startDb = async () => {
  if (isConnected) {
    console.log("Already connected to the database.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default startDb;
