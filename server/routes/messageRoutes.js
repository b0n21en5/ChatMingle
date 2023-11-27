import express from "express";
import {
  getLatestMessage,
  getReceivedMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send-new", sendMessage);

router.get("/get-received/:senderId/:receiverId", getReceivedMessages);

router.get("/get-latest-one/:senderId/:receiverId", getLatestMessage);

export default router;
