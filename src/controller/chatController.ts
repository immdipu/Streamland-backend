import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../middleware/auth-middleware";
import { NextFunction, Response } from "express";
import Chat from "../modal/chatSchema";
import User from "../modal/userSchema";

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
      isGroupChat: false,
    })
      .populate("users", "fullName profilePic _id username")
      .populate("latestMessage", "content sender createdAt")
      .sort({ updatedAt: -1 });

    res.status(200).json(userChat);
  }
);

const createGroupChat = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { name, numberOfUsersAllowed } = req.body;
    if (!name) {
      throw new Error("Please fill all the fields");
    }

    const newChat = await Chat.create({
      isGroupChat: true,
      users: [req.currentUserId],
      numberOfUsersAllowed: numberOfUsersAllowed || 100,
      chatName: name,
      groupAdmin: req.currentUserId,
    });

    res.status(200).json(newChat);
  }
);

const getAllGroupChats = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const chat = await Chat.find({
      isGroupChat: true,
    }).populate("latestMessage", "content sender createdAt");

    if (!chat) {
      throw new Error("Chat not found");
    }

    const chatWithMemeber = chat.map((item) => {
      const isMember = item.users.includes(currentUserId!);
      if (isMember) {
        return { ...item.toObject(), isMember };
      } else {
        return { ...item.toObject(), isMember };
      }
    });

    chatWithMemeber.sort((chatA, chatB) => {
      const isMemberA = chatA.users.includes(currentUserId!);
      const isMemberB = chatB.users.includes(currentUserId!);

      if (isMemberA && !isMemberB) return -1;
      else if (!isMemberA && isMemberB) return 1;

      return 0;
    });

    res.status(200).json(chatWithMemeber);
  }
);

const getGroupDetails = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUserId = req.currentUserId;
    const { chatId } = req.body;
    if (!chatId) {
      throw new Error("Please fill all the fields");
    }
    const userExist = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: currentUserId } },
    });
    if (!userExist) {
      res.status(404);
      throw new Error("You arenot a member of this group");
    }
    const chat = await Chat.findOne({
      _id: chatId,
      isGroupChat: true,
    }).populate("users", "fullName profilePic _id username role");

    res.status(200).json(chat);
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

    const alreadyExist = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    });

    const userExist = await User.findOne({ _id: userId });
    if (!userExist) {
      res.status(404);
      throw new Error("User not found");
    }
    if (alreadyExist) {
      res.status(400);
      throw new Error("User already exist");
    }

    const checkLimit = await Chat.findOne({
      _id: chatId,
    });

    if (checkLimit?.numberOfUsersAllowed === checkLimit?.users.length) {
      res.status(400);
      throw new Error("User limit reached");
    }

    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        // groupAdmin: currentUserId,
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
      res.status(400);
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
      res.status(404);
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
  getAllGroupChats,
  addToGroupChat,
  getGroupDetails,
  removeFromGroupChat,
};
