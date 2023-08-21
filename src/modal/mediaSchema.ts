import { Schema, model } from "mongoose";
import { mediaSchemaTypes } from "../types/media";

const mediaSchema = new Schema<mediaSchemaTypes>(
  {
    id: {
      type: String,
      required: [true, "Id is required"],
    },
    original_title: String,
    name: String,
    title: String,
    backdrop_path: String,
    poster_path: String,
    media_type: String,
    public: {
      type: Boolean,
      default: false,
    },
    release_date: String,
    first_air_date: String,
    vote_average: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Media = model<mediaSchemaTypes>("Media", mediaSchema);

export default Media;
