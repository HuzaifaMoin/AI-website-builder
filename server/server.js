// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { connectToDatabase } from "./config/db.js";
// import authRouter from "./routes/authRoutes.js";
// import projectRouter from "./routes/projectRoutes.js";

// const app = express();

// await connectToDatabase()

// const allowedOrigins = (process.env.ORIGINS || "http://localhost:5173,https://ai-website-builder-z4os.vercel.app")
//   .split(",")
//   .map((origin) => origin.trim())
//   .filter(Boolean);

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//       return;
//     }

//     callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
// }));
// app.use(cookieParser())
// app.use(express.json())

// app.get("/", (req, res)=> res.send("Server is Live!"))
// app.use('/api/auth', authRouter)
// app.use('/api/projects', projectRouter)
// // Centralized error handler
// app.use((err, _req, res, _next)=>{
//     console.error(`[Error] ${err.message}`);
//     res.status(500).json({error: err.message})
// })

// const port = process.env.PORT || 3000
// app.listen(port, ()=>{
//     console.log(`server is running on port: ${port}`)
// })

import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";

const app = express();

const allowedOrigins = [
  process.env.ORIGINS,
  'http://localhost:5173',
  'https://ai-website-builder-z4os.vercel.app'
]
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);

app.use((err, _req, res, _next) => {
  console.error(`[Error] ${err.message}`);
  res.status(500).json({ error: err.message });
});

export default app;