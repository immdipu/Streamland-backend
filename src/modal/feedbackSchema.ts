import { Schema, model } from "mongoose";
import { feedbackSchemaTypes } from "../types/feedback";

const feedbackSchema = new Schema<feedbackSchemaTypes>(
  {
    user: {
      type: Schema.Types.ObjectId,
    },
    name: String,
    message: {
      type: String,
      maxlength: [1000, "Message should be less than 500 characters"],
      required: [true, "Message is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = model<feedbackSchemaTypes>("Feedback", feedbackSchema);
export default Feedback;
