import express from 'express';
import connectDB  from './config/db.js';
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';

import authRoutes from "./routes/authRoutes.js";
import timesheetRoutes from "./routes/timesheetRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();


const __dirname= path.resolve();
const app = express();
app.use(cors());
app.use(express.json());  

app.use("/auth", authRoutes);
app.use("/timesheets", timesheetRoutes);
app.use("/users", userRoutes);

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.get("/", (req, res) => {
  res.send("API is running...");
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});