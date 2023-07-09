import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server listening on port " + port);
    });
  })
  .catch(console.log);
