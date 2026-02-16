import Timesheet from "../models/Timesheet.js";

export const createTimesheet = async (req, res) => {
  try {
    const { date, taskName, hours, description } = req.body;

    const timesheet = await Timesheet.create({
      user: req.user.id,
      date,
      taskName,
      hours,
      description,
    });

    res.status(201).json(timesheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimesheets = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const sheets = await Timesheet.find().populate("user", "name email");
      return res.json(sheets);
    }

    const sheets = await Timesheet.find({ user: req.user.id });
    res.json(sheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { status } = req.body;

    const timesheet = await Timesheet.findById(req.params.id);
    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    timesheet.status = status;
    await timesheet.save();

    res.json(timesheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
