import { Schema } from "mongoose";

export interface messageSchema {
  sender: Schema.Types.ObjectId;
  content: string;
  chat: Schema.Types.ObjectId;
  readBy: Schema.Types.ObjectId[];
}
