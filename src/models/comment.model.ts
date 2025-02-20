import mongoose, { Schema, Model, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IComment extends Document {
  content: string;
  owner: Schema.Types.ObjectId;
  video: Schema.Types.ObjectId;
}

const commentSchema: Schema<IComment> = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true },
);
commentSchema.plugin(mongooseAggregatePaginate);
export const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);
