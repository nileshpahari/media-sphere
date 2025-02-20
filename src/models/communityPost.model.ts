import mongoose, { Model, Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface ICommunityPost extends Document {
    content: string;
    owner: Schema.Types.ObjectId;
}

const communityPostSchema: Schema<ICommunityPost> = new Schema<ICommunityPost>({
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

export const CommunityPost: Model<ICommunityPost> = mongoose.model<ICommunityPost>("CommunityPost", communityPostSchema);