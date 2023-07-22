import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../middleware/auth-middleware";
import { Response, NextFunction } from "express";
import Media from "../modal/mediaSchema";

const AddMedia = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const {
      id,
      original_title,
      name,
      title,
      backdrop_path,
      poster_path,
      media_type,
      release_date,
      first_air_date,
      vote_average,
    } = req.body;
    if (!id || !media_type || !poster_path) {
      res.status(400);
      throw new Error("some fields are missing");
    }
    const media = await Media.create({
      id,
      original_title,
      name,
      title,
      backdrop_path,
      media_type,
      release_date,
      first_air_date,
      vote_average,
      user: req.currentUserId,
    });
    if (media) {
      res.status(200).json(media);
    }
    if (!media) {
      res.status(500);
      throw new Error("something went wrong Try Again!");
    }
  }
);

const RemoveMedia = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const MediaId = req.body.id;
    const media = await Media.findById(MediaId);
    if (!media) {
      res.status(404);
      throw new Error("Media not found");
    }
    if (media.user !== req.currentUserId) {
      res.status(401);
      throw new Error("Not Authorized");
    }
    await Media.findOneAndDelete({ _id: MediaId });
    res.status(200).json(`${media.media_type} removed successfully`);
  }
);

export { AddMedia, RemoveMedia };