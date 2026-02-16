import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createTimesheet,
  getTimesheets,
  updateStatus,
} from "../controllers/timesheetController.js";

const router = express.Router();

router.post("/", protect, createTimesheet);
router.get("/", protect, getTimesheets);
router.put("/:id", protect, updateStatus);

export default router;
