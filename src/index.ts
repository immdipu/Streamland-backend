import express, { NextFunction, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server";
import errorHandler from "./utils/errorHandler";
import userRoutes from "./routes/userRoute";
import mediaRoutes from "./routes/mediaRoute";
import MyTelegrambot from "./controller/notificationController";

let corOptions = {
  origin: "https://www.showmania.xyz",
  // origin: "*",
};

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corOptions));

app.use("/user", userRoutes);
app.use("/media", mediaRoutes);

const port = process.env.PORT || 3000;

app.use(errorHandler);

const token: string = process.env.TELEGRAM_BOT_TOKEN!;
const mybot = new MyTelegrambot(token);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server listening on port " + port);
    });
  })
  .catch(console.log);
