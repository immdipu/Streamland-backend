import mongoose, { Schema, model } from "mongoose";
import { messageSchema } from "../types/message";

const messageModel = new Schema<messageSchema>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    content: { type: String, trim: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },

  {
    timestamps: true,
  }
);

const Message = model("Message", messageModel);

export default Message;
