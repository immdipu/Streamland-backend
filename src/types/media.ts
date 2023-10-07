import { Schema } from "mongoose";

export interface mediaSchemaTypes {
  id: string;
  backdrop_path?: string;
  poster_path: string;
  media_type: "movie" | "tv";
  name?: string;
  original_title?: string;
  title?: string;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  public: false;
  user: Schema.Types.ObjectId;
  type: "history" | "watchlist";
}
