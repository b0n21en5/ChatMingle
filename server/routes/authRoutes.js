import express from "express";
import {
  getAllUsers,
  getProfileImage,
  loginController,
  registerUserController,
  resetPasswordController,
  searchUserController,
  updateUserController,
} from "../controllers/authController.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

router.post("/register-user", formidableMiddleware(), registerUserController);
router.put("/update-user", formidableMiddleware(), updateUserController);

router.post("/login", loginController);

router.put("/reset-password", resetPasswordController);

router.get("/user/profile-image/:uid", getProfileImage);

// Query param: uid
router.get("/get-all-users", getAllUsers);

router.get("/search-users/:searchQry", searchUserController);

export default router;
