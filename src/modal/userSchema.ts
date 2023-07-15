import { Schema, model } from "mongoose";
import { userSchemaTypes } from "../types/user";

const userSchema = new Schema<userSchemaTypes>(
  {
    fullName: {
      type: String,
      required: [true, "fullName is required"],
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      trim: true,
      select: false,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    profilePic: {
      type: String,
      default: "https://i5.extraimage.xyz/pix/2023/07/03/u6FQgX.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const User = model<userSchemaTypes>("User", userSchema);
export default User;