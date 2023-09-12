import { IRequest } from "../middleware/auth-middleware";
import { Response, NextFunction } from "express";
import Message from "../modal/messageSchema";
import Chat from "../modal/chatSchema";
import expressAsyncHandler from "express-async-handler";

const sendMessage = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      res.status(400);
      throw new Error("please fill all the fields");
    }
    const message = await Message.create({
      content: content,
      sender: currentUserId,
      chat: chatId,
    });

    const messageWithSender = await message.populate(
      "sender",
      "name profilePic _id username"
    );

    await Chat.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        latestMessage: message._id,
      }
    );

    res.status(200).json(messageWithSender);
  }
);

const getAllMessages = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const chatId = req.params.chatId;

    if (!chatId) {
      res.status(400);
      throw new Error("please fill all the fields");
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    const userInChat = chat.users.find((user) => user == currentUserId);

    if (!userInChat) {
      res.status(404);
      throw new Error("You are not not authorized to view this chat");
    }

    const messages = await Message.find({
      chat: chatId,
    })
      .populate("sender", "name profilePic _id username fullName")
      .populate("chat", "chatName isGroupChat users groupAdmin");

    if (!messages) {
      res.status(404);
      throw new Error("No messages found");
    }
    if (messages.length === 0) {
      res.status(404);
      throw new Error("No messages found");
    }
    res.status(200).json(messages);
  }
);

export { sendMessage, getAllMessages };
