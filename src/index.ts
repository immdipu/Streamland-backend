import express, { NextFunction, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server";
import errorHandler from "./utils/errorHandler";
import userRoutes from "./routes/userRoute";
import mediaRoutes from "./routes/mediaRoute";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var corsOptions = {
  origin: "https://cinemaa.vercel.app/",
};
app.use(cors(corsOptions));

app.use("/user", userRoutes);
app.use("/media", mediaRoutes);

const port = process.env.PORT || 4000;

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server listening on port " + port);
    });
  })
  .catch(console.log);
