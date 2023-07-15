import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./server";
import errorHandler from "./utils/errorHandler";
import userRoutes from "./routes/userRoute";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", userRoutes);

const port = process.env.PORT || 3000;

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server listening on port " + port);
    });
  })
  .catch(console.log);
