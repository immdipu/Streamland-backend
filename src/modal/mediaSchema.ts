import { Schema, model } from "mongoose";
import { mediaSchemaTypes } from "../types/media";

const mediaSchema = new Schema<mediaSchemaTypes>(
  {
    id: String,
    original_title: String,
    name: String,
    title: String,
    backdrop_path: String,
    poster_path: String,
    media_type: String,
    release_date: String,
    first_air_date: String,
    vote_average: String,
  },
  { timestamps: true }
);

const Media = model<mediaSchemaTypes>("Media", mediaSchema);

export default Media;
