import { Schema } from "mongoose";

export interface feedbackSchemaTypes {
  user?: Schema.Types.ObjectId;
  name?: string;
  message: string;
}
