import express from "express";
import {
  getAllUsers,
  loginController,
  registerUserController,
  resetPasswordController,
  searchUserController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register-user", registerUserController);

router.post("/login", loginController);

router.post("/reset-password", resetPasswordController);

// Query param: uid
router.get("/get-all-users", getAllUsers);

router.get("/search-users/:searchQry", searchUserController);

export default router;
