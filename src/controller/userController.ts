import mongoose, { Schema } from "mongoose";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../modal/userSchema";
import jwt from "jsonwebtoken";
import { userSchemaTypes } from "../types/user";
import jwt_decode from "jwt-decode";
import { googlePayloadTypes } from "../types/user";

const jwtToken = (id: mongoose.Types.ObjectId) => {
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
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.email,
        profilePic: newUser.profilePic,
        token: jwtToken(newUser._id),
      });
    }
  }
);

const Login = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
      res.status(400);
      throw new Error("username or email is required");
    }
    if (!password) {
      res.status(400);
      throw new Error("password is required");
    }
    const userExist = await User.findOne({
      $or: [{ username }, { email }],
    }).select("+password");
    if (!userExist) {
      res.status(404);
      throw new Error("user not found");
    }
    if (userExist.loggedInWithGoogle) {
      res.status(405);
      throw new Error("You are already logged in via Google with this email");
    }
    if (req.body.password !== userExist.password) {
      res.status(401);
      throw new Error("password doesn't match");
    }
    res.status(200).json({
      _id: userExist._id,
      fullName: userExist.fullName,
      username: userExist.username,
      profilePic: userExist.profilePic,
      token: jwtToken(userExist._id),
    });
  }
);

const AutoLogin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const heade = req.headers["authorization"];
    const token = heade?.split(" ")[1];

    if (!token) {
      res.status(401);
      throw new Error("Token not found");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: Schema.Types.ObjectId;
    };
    const user: userSchemaTypes | null = await User.findById(decode.id).select(
      "fullName profilePic username"
    );
    if (!user) {
      res.status(401);
      throw new Error("Invalid token! User not found");
    }
    res.status(200).json(user);
  }
);

const googleLogin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token;
    if (!token) {
      res.status(400);
      throw new Error("No token found");
    }
    const payload: googlePayloadTypes = jwt_decode(token);

    const { email_verified, email, name, picture } = payload;
    const user = await User.findOne({ email: email });
    if (user) {
      if (!user.loggedInWithGoogle) {
        user.loggedInWithGoogle = true;
        user.profilePic = picture;
        user.email_verified = email_verified;
        await user.save();
        res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          profilePic: user.profilePic,
          token: jwtToken(user._id),
        });
      }
      if (user.loggedInWithGoogle) {
        res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          profilePic: user.profilePic,
          token: jwtToken(user._id),
        });
      }
    }
    if (!user) {
      const newuser = await User.create({
        fullName: name,
        email: email,
        email_verified: email_verified,
        profilePic: picture,
        username: email.split("@")[0],
        loggedInWithGoogle: true,
      });
      if (newuser) {
        res.status(200).json({
          _id: newuser._id,
          fullName: newuser.fullName,
          username: newuser.username,
          profilePic: newuser.profilePic,
          token: jwtToken(newuser._id),
        });
      }
    }
  }
);

export { Signup, AutoLogin, Login, googleLogin };
