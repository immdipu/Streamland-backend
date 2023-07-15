import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../middleware/auth-middleware";
import { Response, NextFunction } from "express";

const AddMedia = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {}
);
