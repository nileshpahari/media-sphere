import mongoose, { Schema, Model, Document} from "mongoose";

export interface ILike extends Document {
    likedBy: Schema.Types.ObjectId;
    video: Schema.Types.ObjectId;
    comment: Schema.Types.ObjectId;
    communityPost: Schema.Types.ObjectId;
}

const likeSchema: Schema<ILike> = new Schema<ILike>({
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    },
    comment : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    communityPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityPost",
    }

}, { timestamps: true })

export const Like: Model<ILike> = mongoose.model<ILike>("Like", likeSchema);

