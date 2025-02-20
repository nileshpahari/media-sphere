import mongoose, { Schema, Document, Model} from "mongoose";

export interface IPlaylist extends Document {
   name: string,
   description: string,
   owner: Schema.Types.ObjectId,
   videos: Schema.Types.ObjectId[] 
}
const playlistSchema: Schema<IPlaylist> = new Schema<IPlaylist>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        }
    ]
}, { timestamps: true })

export const Playlist: Model<IPlaylist> = mongoose.model<IPlaylist>("Playlist", playlistSchema);