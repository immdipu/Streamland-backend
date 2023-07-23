import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import User from "../modal/userSchema";
import { userSchemaTypes } from "../types/user";

export interface IRequest extends Request {
  currentUserId?: Schema.Types.ObjectId;
}

export const TokenVerify = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const headers = req.headers["authorization"];
    const token = headers?.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("token not found, UnAuthorized!");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: Schema.Types.ObjectId;
    };
    const user: userSchemaTypes | null = await User.findById(decode.id);
    console.log(decode);
    if (!user) {
      res.status(401);
      throw new Error("token invalid Login Again");
    }
    if (user) {
      req.currentUserId = decode.id as any;
      next();
    }
  }
);
