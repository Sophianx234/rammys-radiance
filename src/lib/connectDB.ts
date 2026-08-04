import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    // Exclusively use the remote database as requested
    const dbUrl = process.env.DATABASE_URL?.replace('<db_password>', process.env.DATABASE_PASSWORD || '');
    if (!dbUrl) throw new Error("DATABASE_URL is missing");
    
    await mongoose.connect(dbUrl);
    console.log("Connected to Remote MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};