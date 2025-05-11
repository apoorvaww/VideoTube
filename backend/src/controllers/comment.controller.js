import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js"


const getVideoComments = asyncHandler(async(req, res) => {
    // get all comments for a video
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400, "no video id found")
    }
    // console.log(videoId)
    const {page = 1, limit = 10} = req.query
    // this portion over here is used for pagination
    // basically if there are 1000 comments in a video i wouldn't want to send all of them over when a request hits. so i send them over in pages and limit 10 comments to a page.
    const skip = (page - 1) * limit;
    
    // const comments = await Comment.findById(videoId)
    // .skip(skip)
    // .limit(limit)

    const comments = await Comment.find({
        video: videoId,
        parentComment: null // this will return only the top-level comments
    })
    .select("content owner")
    .populate({
        path: "owner",
        select: "username avatar"
    })
    .sort({createdAt: -1})
    .skip(skip).limit(limit);

    // console.log(comments)

    return res
    .status(200)
    .json( new ApiResponse(200, comments, "top-level comments of videos sent successfully"))

})

const addReplyToComment = asyncHandler(async(req, res) => {
    const {commentId} = req.params;
    const {videoId, content, userId} = req.body;
    if(!videoId || !commentId) {
        throw new ApiError(400, "video id and commentId is required");
    }

    if(!content) {
        throw new ApiError(400, "comment id is required")
    }

    if(!userId) {
        throw new ApiError(400, "user id is required")
    }

    const parentCommentId = await Comment.findById(commentId);
    if(!parentCommentId) {
        throw new ApiError(400, "parent comment id not found");
    }

    const reply = await Comment.create({
        content,
        video: videoId,
        owner: userId,
        parentComment: commentId,
    });

    if(!reply) {
        throw new ApiError(400, "couldn't create reply to comment")
    }

    const populatedReply = await reply.populate("owner", "username avatar" )

    return res
    .status(201)
    .json(new ApiResponse(201, populatedReply, "reply to comment addee successfully"))


})

const getCommentReplies = asyncHandler(async(req, res)=>{
    const {commentId} = req.params;

    if(!commentId) {
        throw new ApiError(400, "no parent comment id provided")
    }

    const replies = await Comment.find({
        parentComment: commentId
    })
    .select("content owner createdAt")
    .populate({
        path: "owner",
        select: "username avatar"
    })
    .sort({createdAt: 1}) 
    .lean()

    return res
    .status(200)
    .json(new ApiResponse(200, replies, "replies fetched successfully"))

} )

const addComment = asyncHandler(async(req, res) => {
    /// add commnets to a video
    const {videoId} = req.params;

    if(!videoId) {
        throw new ApiError(400, "video id not found")
    }

    const video = await Video.findById(videoId)

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
    const {commentId} = req.params

    if(!newComment) {
        throw new ApiError(400, "This field is required")
    }
    // console.log(newComment)

    const comment = await Comment.findByIdAndUpdate(
        commentId,
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
    const {commentId} = req.params

    console.log(commentId)

    if(!commentId) {
        throw new ApiError(400, "Error in finding the comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(200, {}, "Comment deleted successfully")


})

export{
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
    addReplyToComment,
    getCommentReplies
}