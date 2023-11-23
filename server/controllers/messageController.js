import { clientError, serverError } from "../helpers/handleErrors.js";
import messageModel from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender) {
      return clientError(res, "Sender id required!");
    }
    if (!receiver) {
      return clientError(res, "Receiver id required!");
    }
    if (!message) {
      return clientError(res, "Enter message!");
    }

    const newMessage = await new messageModel(req.body).save();

    return res.status(200).send(newMessage);
  } catch (error) {
    return serverError(res, error, "Error While sending message!");
  }
};

export const getReceivedMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const receivedMessage = await messageModel.find({
      sender: senderId,
      receiver: receiverId,
    });

    return res.status(200).send(receivedMessage);
  } catch (error) {
    return serverError(res,error, "Error while fetching received messages!");
  }
};