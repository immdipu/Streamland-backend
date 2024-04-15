import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../middleware/auth-middleware";
import { Response, NextFunction, Request } from "express";
import Media from "../modal/mediaSchema";
import YouTube from "youtube-sr";

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
      type,
    } = req.body;
    if (!id || !media_type || !poster_path) {
      res.status(400);
      throw new Error("some fields are missing");
    }
    const alreadyExist = await Media.findOne({
      $and: [
        { id: id },
        { user: req.currentUserId },
        { media_type: media_type },
        { type: type },
      ],
    });

    if (alreadyExist) {
      res.status(404);
      throw new Error("Already added to watchlist");
    }

    const media = await Media.create({
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
      user: req.currentUserId,
      type,
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

const AddMediaToHistory = expressAsyncHandler(
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
      type,
    } = req.body;
    if (!id || !media_type || !poster_path || !type) {
      res.status(400);
      throw new Error("some fields are missing");
    }
    const alreadyExist = await Media.findOne({
      $and: [
        { id: id },
        { user: req.currentUserId },
        { media_type: media_type },
        { type: type },
      ],
    });

    if (alreadyExist) {
      await Media.findOneAndDelete({
        $and: [
          { _id: alreadyExist._id },
          { user: req.currentUserId },
          { media_type: media_type },
          { type: type },
        ],
      });
    }

    const media = await Media.create({
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
      user: req.currentUserId,
      type,
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
    const MediaId = req.params.id;
    const media = await Media.findById(MediaId);
    if (!media) {
      res.status(404);
      throw new Error("Media not found");
    }
    if (media.user.toString() !== req.currentUserId!.toString()) {
      res.status(401);
      throw new Error("Not Authorized");
    }
    await Media.findOneAndDelete({ _id: MediaId });
    res.status(200).json(`${media.media_type} removed successfully`);
  }
);

const GetMedia = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const history = await Media.find({
      user: req.currentUserId,
      type: "history",
    }).sort({ createdAt: -1 });
    const watchlist = await Media.find({
      user: req.currentUserId,
      type: "watchlist",
    }).sort({ createdAt: -1 });
    res.status(200).json({ history, watchlist });
  }
);

const SearchVideos = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction): Promise<any> => {
    const { searchTerm } = req.body;
    if (!searchTerm)
      return res.status(400).json({ message: "Search term is required" });
    const Results = await YouTube.search(searchTerm, {
      limit: 5,
      type: "video",
    });
    if (Results) {
      res.status(200).json(Results);
    }
    if (!Results) {
      res.status(404);
      throw new Error("No Results Found");
    }
  }
);

export { AddMedia, RemoveMedia, GetMedia, AddMediaToHistory, SearchVideos };
