import express from "express";
import { updateUser, deleteUser, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.put("/:id", updateUser); 
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);

export default router;