import express, { NextFunction, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server";
import errorHandler from "./utils/errorHandler";
import userRoutes from "./routes/userRoute";
import mediaRoutes from "./routes/mediaRoute";
import TelegramBot, { Message } from "node-telegram-bot-api";
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
// const bot = new TelegramBot(token);
const BASEURL = process.env.BASE_URL;

const bot = new MyTelegrambot(token, BASEURL!);

// bot.setWebHook(`${BASEURL}/bot${token}`);

// app.post(`/bot${token}`, (req, res) => {
//   const data = bot.processUpdate(req.body);
//   console.log(data);
// });

connectDB()
  .then(() => {
    app.listen(port, () => {
      bot.AnyMessage();
      console.log("Server listening on port " + port);
    });
  })
  .catch(console.log);
