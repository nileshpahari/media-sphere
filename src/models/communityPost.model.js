import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const communityPostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true })

communityPostSchema.plugin(mongooseAggregatePaginate)
export const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);