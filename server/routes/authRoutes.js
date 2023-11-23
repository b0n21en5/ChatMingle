import express from "express";
import {
  getAllUsers,
  loginController,
  registerUserController,
  resetPasswordController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register-user", registerUserController);

router.post("/login", loginController);

router.post("/reset-password", resetPasswordController);

router.get("/get-all-users", getAllUsers);

export default router;
