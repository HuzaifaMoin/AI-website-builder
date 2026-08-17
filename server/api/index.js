import app from "../server.js";
import { connectToDatabase } from "../config/db.js";

export default async function handler(req, res) {
  await connectToDatabase();
  return app(req, res);
}