import { Schema } from "mongoose";

export interface chatSchemaTypes {
  chatName: string;
  isGroupChat: boolean;
  users: Schema.Types.ObjectId[];
  latestMessage: Schema.Types.ObjectId;
  groupAdmin: Schema.Types.ObjectId;
}
