import mongoose, {isValidObjectId} from "mongoose";
import {Like} from '../models/like.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async(req, res) => {
    const {videoId } = req.params
    // TODO: toggle like on a video
    const {userId} = req.body

    if(!videoId) {
        throw new ApiError(400, "video id not found")
    }

    if(!userId) {
        throw new ApiError(400, "user id not found")
    }

    const existingLikeStatus = await Like.find({
        video: videoId,
        likedBy: userId
    })

    console.log(existingLikeStatus);
    let message = ""

    if(existingLikeStatus) {
        await Like.deleteOne({
            video: videoId,
            likedBy: userId
        })
        message="Removed like from video successfully"
        console.log("Removed like from video successfully")
    }
    else{
        await Like.create({
            video: videoId,
            likedBy: userId
        })
        message="Liked video successfully"
        console.log("Liked video successfully")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, existingLikeStatus, message))

})


const toggleCommentLike = asyncHandler(async(req, res) => {    
    // TODO: toggle like on a comment

    const {commentId } = req.params
    const {userId} = req.body

    if(!commentId) {
        throw new ApiError(400, "comment id not found")
    }

    if(!userId) {
        throw new ApiError(400, "user id not found")
    }

    const existingLikeStatusOnComment = await Like.find({
        comment: commentId,
        likedBy: userId
    })

    console.log(existingLikeStatus);
    let message = ""

    if(existingLikeStatus) {
        await Like.deleteOne({
            comment: commentId,
            likedBy: userId
        })
        message="Removed like from comment successfully"
        console.log("Removed like from comment successfully")
    }
    else{
        await Like.create({
            comment: comment,
            likedBy: userId
        })
        message="Liked comment successfully"
        console.log("Liked comment successfully")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, existingLikeStatus, message))
})

const toggleTweetLike = asyncHandler(async(req, res) => {   
     // TODO: toggle like on a tweet

    const {tweetId } = req.params
    const {userId} = req.body

    if(!tweetId) {
        throw new ApiError(400, "tweet id not found")
    }

    if(!userId) {
        throw new ApiError(400, "user id not found")
    }

    const existingLikeStatus = await Like.find({
        tweet: tweetId,
        likedBy: userId
    })

    console.log(existingLikeStatus);
    let message = ""

    if(existingLikeStatus) {
        await Like.deleteOne({
            tweet: tweetId,
            likedBy: userId
        })
        message="Removed like from Tweet successfully"
        console.log("Removed like from tweet successfully")
    }
    else{
        await Like.create({
            tweet: tweetId,
            likedBy: userId
        })
        message="Liked tweet successfully"
        console.log("Liked tweet successfully")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, existingLikeStatus, message))
})

const getLikedVideos = asyncHandler(async(req, res) => {
    // TODO: get all the videos liked by a user
    // to get all the liked videos we will have to search the like model by user's id from the request.
    const {userId} = req.body

    if(!userId){
        throw new ApiError(400, "user id not found")
    }

    const likedVideos = await Like.find({
        likedBy: userId
    }).select("video")

    if(likedVideos.length === 0) {
        return res.status(200).json(new ApiResponse(200, {}, "user hasn't liked any video yet."))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "list of liked videos sent successfully"))

})

export {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}
