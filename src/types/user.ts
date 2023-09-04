import { ObjectId, Schema } from "mongoose";

export interface userSchemaTypes {
  fullName: string;
  email: string;
  password: string;
  username: string;
  profilePic: string;
  email_verified: boolean;
  loggedInWithGoogle: boolean;
  genre: string[];
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
  bio: string;
  facebook: string;
  twitter: string;
  instagram: string;
  github: string;
  role: "admin" | "user";
}

export interface googlePayloadTypes {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  username: string;
  email_verified: boolean;
}
