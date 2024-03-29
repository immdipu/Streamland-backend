import { Schema, model } from "mongoose";

const SurveySchema = new Schema<any>(
  {
    name: String,
    source: String,
    otherSource: String,
    rating: Number,
    feedback: String,
  },
  {
    timestamps: true,
  }
);

const Survey = model<any>("Survey", SurveySchema);
export default Survey;
