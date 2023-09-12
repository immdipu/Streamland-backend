import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../middleware/auth-middleware";
import { NextFunction, Response } from "express";
import Chat from "../modal/chatSchema";

const accessCreateSingleChat = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const otherUserId = req.body.userId;
    const alreadyChat = await Chat.findOne({
      isGroupChat: false,
      users: { $size: 2, $all: [currentUserId, otherUserId] },
    })
      .populate("users", "name profilePic _id username")
      .populate("latestMessage");

    if (alreadyChat) {
      res.status(200).json(alreadyChat);
    } else {
      const newChat = await Chat.create({
        isGroupChat: false,
        users: [currentUserId, otherUserId],
        chatName: "Sender",
      });
      const newChatPopulated = await newChat.populate(
        "users",
        "name profilePic _id username"
      );
      res.status(200).json(newChatPopulated);
    }
  }
);

const getUserChats = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const userChat = await Chat.find({
      users: { $elemMatch: { $eq: currentUserId } },
    })
      .populate("users", "fullName profilePic _id username")
      .populate("latestMessage", "content sender createdAt")
      .sort({ updatedAt: -1 });

    res.status(200).json(userChat);
  }
);

const createGroupChat = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { usersId, name } = req.body;
    if (!usersId || !name) {
      throw new Error("Please fill all the fields");
    }
    if (usersId.length < 0) {
      throw new Error("Please select atleast one user");
    }
    const newChat = await Chat.create({
      isGroupChat: true,
      users: [...usersId, req.currentUserId],
      chatName: name,
      groupAdmin: req.currentUserId,
    });

    res.status(200).json(newChat);
  }
);

const renameGroupChat = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const { chatId, name } = req.body;
    if (!chatId || !name) {
      throw new Error("Please fill all the fields");
    }
    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        groupAdmin: currentUserId,
        isGroupChat: true,
      },
      { chatName: name },
      { new: true }
    );
    if (!chat) {
      throw new Error("Chat not found");
    }
    res.status(200).json(chat);
  }
);

const addToGroupChat = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      throw new Error("Please fill all the fields");
    }
    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        groupAdmin: currentUserId,
        isGroupChat: true,
      },
      {
        $push: { users: userId },
      }
    );
    if (!chat) {
      throw new Error("Chat not found");
    }
    res.status(200).json(chat);
  }
);

const removeFromGroupChat = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      throw new Error("Please fill all the fields");
    }
    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        isGroupChat: true,
        groupAdmin: currentUserId,
      },
      {
        $pull: { users: userId },
      }
    );
    if (!chat) {
      throw new Error("Chat not found");
    }
    res.status(200).json(chat);
  }
);

const deleteGroupChat = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const { chatId } = req.body;
    if (!chatId) {
      throw new Error("Please fill all the fields");
    }
    const chat = await Chat.findOneAndDelete({
      _id: chatId,
      isGroupChat: true,
      groupAdmin: currentUserId,
    });
    if (!chat) {
      throw new Error("Chat not found");
    }
    res.status(200).json(chat);
  }
);

export {
  accessCreateSingleChat,
  getUserChats,
  createGroupChat,
  renameGroupChat,
  deleteGroupChat,
};
