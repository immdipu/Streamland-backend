import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../modal/userSchema";
import jwt from "jsonwebtoken";

const jwtToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const Signup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, username, profilePic, password } = req.body;
    if (!fullName || !email || !username || !password) {
      res.status(400);
      throw new Error("some fields are missing");
    }
    const AlreadyExist = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (AlreadyExist) {
      res.status(403);
      throw new Error("user already exist with the email or username");
    }
    const newUser = await User.create({
      fullName: req.body.fullName,
      email: req.body.email.trim(),
      username: req.body.username.trim(),
      password: req.body.password,
      profilePic: req.body.profilePic,
    });
    if (newUser) {
      res.status(200).json({
        fullName: newUser.fullName,
        username: newUser.email,
        profilePic: newUser.profilePic,
        token: jwtToken(newUser.id),
      });
    }
  }
);

export { Signup };
