import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
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

export const Like = mongoose.model("Like", likeSchema);
