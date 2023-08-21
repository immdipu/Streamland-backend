import { ObjectId, Schema } from "mongoose";

export interface userSchemaTypes {
  fullName: string;
  email: string;
  password: string;
  username: string;
  profilePic: string;
  email_verified: boolean;
  loggedInWithGoogle: boolean;
  favouriteGenre:
    | "Action"
    | "Adventure"
    | "Animation"
    | "Comedy"
    | "Crime"
    | "Documentary"
    | "Drama"
    | "Fantasy"
    | "Drama"
    | "Horror"
    | "Mystery"
    | "Romance"
    | "Science Fiction"
    | "Thriller"
    | "War";

  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
}

export interface googlePayloadTypes {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  username: string;
  email_verified: boolean;
}
