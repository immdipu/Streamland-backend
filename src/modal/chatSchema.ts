import { Model, Schema, model } from "mongoose";
import { chatSchemaTypes } from "../types/chat";

const chatSchema = new Schema<chatSchemaTypes>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model<chatSchemaTypes>("Chat", chatSchema);

export default Chat;
