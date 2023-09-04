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
      unique: true,
      lowercase: true,
      required: [true, "Username is required"],
    },
    role: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      select: false,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      select: false,
    },
    profilePic: {
      type: String,
      default: "https://i.imgur.com/phEO72D.png",
    },
    loggedInWithGoogle: {
      type: Boolean,
      default: false,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    genre: [String],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    facebook: String,
    twitter: String,
    instagram: String,
    github: String,
    bio: String,
  },
  {
    timestamps: true,
  }
);

const User = model<userSchemaTypes>("User", userSchema);
export default User;
