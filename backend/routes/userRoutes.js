import express from "express";
import { updateUser, deleteUser, getAllUsers } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);
router.get("/", protect, getAllUsers);

export default router;
