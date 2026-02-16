import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only update your own account" });
    }

    const updates = { ...req.body };

    if (req.user.role !== "admin" && updates.role) {
      delete updates.role;
    }

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own account" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

