import express, { NextFunction, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server";
import errorHandler from "./utils/errorHandler";
import userRoutes from "./routes/userRoute";
import mediaRoutes from "./routes/mediaRoute";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import { Server, Socket } from "socket.io";
import { MessageReceivedTypes } from "./types/socketTypes";

dotenv.config();

const app = express();
connectDB();

let corOptions = {
  origin:
    process.env.NODE_ENV === "production" ? "https://www.showmania.xyz" : "*",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corOptions));

app.use("/user", userRoutes);
app.use("/media", mediaRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

const port = process.env.PORT! || 3000;

// const TELEGRAM_PORT = Number(process.env.TELEGRAM_PORT!) || 3001;

app.use(errorHandler);

// const token: string = process.env.TELEGRAM_BOT_TOKEN!;
// const options = {
//   webHook: {
//     port: TELEGRAM_PORT,
//   },
// };
// const bot = new TelegramBot(token, options);
// const BASEURL = process.env.BASE_URL;
// bot.setWebHook(`${BASEURL}/bot${token}`);

// app.post(`/bot${token}`, (req, res) => {
//   const message: Message = req.body.message;
//   if (message) {
//     const myBot = new MyTelegrambot(message, bot);
//     myBot
//       .AnyMessag()
//       .then(() => {
//         res.status(200).send("Message sent successfully");
//       })
//       .catch((error) => {
//         console.error("Error sending message:", error);
//         res.status(500).send("Error sending message");
//       });
//   } else {
//     res.status(200).send("No message received");
//   }
// });

const server = app.listen(port, () => {
  console.log("Server listening on port " + port);
});

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? "https://www.showmania.xyz" : "*",
  },
});

const connectedUsers = new Set();
const rooms = new Set();

io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnected: " + socket.id);
  });

  connectedUsers.add(socket.id);

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);
    if (rooms.has(socket.id)) rooms.delete(socket.id);
    console.log("User disconnected: " + socket.id);
  });

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    rooms.add(userData.id);
    console.log("User joined room: " + userData.id);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log("User joined chat: " + room);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log("User left chat: " + room);
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("Usertyping", room);
  });

  socket.on("stop typing", (room) => {
    socket.to(room).emit("userStopTyping", room);
  });

  socket.on("new message", (message: MessageReceivedTypes) => {
    const chat = message.chat;
    if (!chat.users) return;
    chat.users.forEach((user) => {
      if (user === message.sender._id) return;
      socket.in(user).emit("message received", message);
    });
  });
});
