import app from "../app.js";
import { connectToDatabase } from "../config/db.js";

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      error: "Database connection failed",
    });
  }
}