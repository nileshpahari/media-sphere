import mongoose, { Schema, Model, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IVideo extends Document {
    videoFile: string,
    thumbnail: string,
    title: string,
    owner: Schema.Types.ObjectId,
    description: string,
    duration: number,
    views: number,
    isPublished: boolean
}

const videoSchema: Schema<IVideo> = new Schema<IVideo>({
    videoFile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
        required: true,
    }, views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate);

export const Video: Model<IVideo> = mongoose.model<IVideo>("Video", videoSchema);