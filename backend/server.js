import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//routes
app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on port ${PORT}`);
});
