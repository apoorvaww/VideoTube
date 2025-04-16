import mongoose, { model, Schema, SchemaTypes} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    video: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, 
{
    timestamps: true
}
)

export const Playlist = new model("Playlist", playlistSchema)