import mongoose from "mongoose";
import { Comment } from "../models/comment.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const getVideoComments = asyncHandler(async(req, res) => {
    // get all comments for a video
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400, "no video id found")
    }
    const {page = 1, limit = 10} = req.query
    // this portion over here is used for pagination
    // basically if there are 1000 comments in a video i wouldn't want to send all of them over when a request hits. so i send them over in pages and limit 10 comments to a page.
    const skip = (page - 1) * limit;
    
    const videos = await Comment.findById(videoId)
    .skip(skip)
    .limit(limit)

    return res
    .status(200)
    .json( new ApiResponse(200, videos, "comments of videos sent successfully"))

})

const addComment = asyncHandler(async(req, res) => {
    /// add commnets to a video
    const {videoId} = req.params;

    if(!videoId) {
        throw new ApiError(400, "video id not found")
    }

    const video = await Comment.findById(videoId)

    if(!video) {
        throw new ApiError(400, "Video is not found")
    }

    const newComment = await Comment.create({
        content: req.body.content,
        video: videoId,
        owner: req.user?.id
    })

    return res
    .status(200)
    .json(200, newComment, "new comment added successfully")

})

const updateComment = asyncHandler(async(req, res) => {

    const {newComment} = req.body

    if(!comment) {
        throw new ApiError(400, "This field is required")
    }

    const comment = await Comment.findByIdAndUpdate(
        req.comment?._id,
        {
            $set: {
                content: newComment
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async(req, res) => {
    const id = req.params.id

    if(!id) {
        throw new ApiError(400, "Error in finding the comment")
    }

    await Comment.findByIdAndDelete(id)

    return res
    .status(200)
    .json(200, {}, "Comment deleted successfully")


})

export{
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}