import expressAsyncHandler from "express-async-handler";
import { Response, NextFunction, Request } from "express";
import Feedback from "../modal/feedbackSchema";

const AddFeedback = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, message, user } = req.body;
    if (!message) {
      res.status(400);
      throw new Error("message is required");
    }
    const feedback = await Feedback.create({
      name,
      message,
      user,
    });
    if (feedback) {
      res.status(200).json("Thank you for your feedback");
    }
    if (!feedback) {
      res.status(500);
      throw new Error("something went wrong Try Again!");
    }
  }
);

export { AddFeedback };
