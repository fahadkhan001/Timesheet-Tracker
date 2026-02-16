import express from 'express';
import connectDB  from './config/db.js';
import dotenv from "dotenv";
import cors from "cors";





dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());    

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});