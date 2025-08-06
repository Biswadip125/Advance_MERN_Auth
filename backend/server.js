import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`server is running on port ${process.env.PORT}`);
});
