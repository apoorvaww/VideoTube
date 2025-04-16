import mongoose, {model, Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const likeSchema = new model(
    {
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        }, 
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            
        },
        updatedAt: {
            type: Date,
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }, 
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        }
    }, 
    {
        timestamps: true
    }
)

likeSchema.plugin(mongooseAggregatePaginate)

export const Like = mongoose.model("Like", likeSchema)