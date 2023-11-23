import express from "express";
import {
  getReceivedMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send-new", sendMessage);

router.get("/get-received/:senderId/:receiverId", getReceivedMessages);

export default router;
