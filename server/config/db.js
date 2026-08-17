// import mongoose from "mongoose";

// export async function connectToDatabase() {
//     mongoose.connection.on('connected', ()=>{  
//     console.log("successfully connected");
//     })
//     await mongoose.connect(process.env.MONGODB_URI)
// }

import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};