import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  deleteChatForBoth,
  deleteChatForSelf,
  deleteMsgsForBoth,
  deleteMsgsForSelf,
  getMessages,
  markMsgAsSeen,
  sendMsg,
} from "../controllers/MessageController.js";

const messageRouter = express.Router();

messageRouter.get("/:id", auth, getMessages);
messageRouter.put("/mark/:id", auth, markMsgAsSeen);
messageRouter.post("/send/:id", auth, sendMsg);
messageRouter.post("/delete-msg-both/:id", auth, deleteMsgsForBoth);
messageRouter.post("/delete-msg-self/:id", auth, deleteMsgsForSelf);
messageRouter.post("/delete-chat-both/:id", auth, deleteChatForBoth);
messageRouter.post("/delete-chat-self/:id", auth, deleteChatForSelf);

export default messageRouter;
