import express, { NextFunction, Response } from "express";
import dotenv from "dotenv";

import connectDB from "./server";
import errorHandler from "./utils/errorHandler";
import userRoutes from "./routes/userRoute";
import mediaRoutes from "./routes/mediaRoute";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options("*", function (req, res) {
  res.sendStatus(200);
});

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://cinemaa.vercel.app");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
} else if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://cinemaa.vercel.app");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, authorization"
    );

    next();
  });
}

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
