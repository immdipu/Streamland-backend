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

const port = process.env.PORT! || 3000;

const TELEGRAM_PORT = Number(process.env.TELEGRAM_PORT!) || 3001;

app.use(errorHandler);

const token: string = process.env.TELEGRAM_BOT_TOKEN!;
const options = {
  webHook: {
    port: TELEGRAM_PORT,
  },
};
const bot = new TelegramBot(token, options);
const BASEURL = process.env.BASE_URL;
bot.setWebHook(`${BASEURL}/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
  const message: Message = req.body.message;
  if (message) {
    const myBot = new MyTelegrambot(message, bot);
    myBot
      .AnyMessag()
      .then(() => {
        res.status(200).send("Message sent successfully");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        res.status(500).send("Error sending message");
      });
  } else {
    res.status(200).send("No message received");
  }
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server listening on port " + port);
    });
  })
  .catch(console.log);
