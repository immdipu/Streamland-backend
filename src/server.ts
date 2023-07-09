import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const url = process.env.DB as string;
    mongoose.connect(url);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to mongoDB", error);
  }
};

export default connectDB;
