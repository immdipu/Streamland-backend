import { Schema, model } from "mongoose";
import { notificationSchemaTypes } from "../types/notification";

const notificationSchema = new Schema<notificationSchemaTypes>(
  {
    notifications: String,
  },
  {
    timestamps: true,
  }
);

const Notification = model("Notification", notificationSchema);

export default Notification;
