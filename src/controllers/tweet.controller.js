import mongoose, {isValidObjectId} from "mongoose";
import {tweet, Tweet} from '../models/tweet.model.js'
import {User} from '../models/user.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createTweet = asyncHandler(async(req, res) => {
    // TODO: CREATE TWEET
    const {content}  = req.body
    const {userId} = req.params

    if(!content) {
        throw new ApiError(400, "content field is required")
    }

    if(!userId) {
        throw new ApiError(400, "no user id found, you can't tweet")
    }

    const tweet = Tweet.create({
        owner: userId,
        content: content
    })

    console.log(tweet)

    if(!tweet) {
        throw new ApiError(500, "something went wrong")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, tweet, "tweet created successfully"))

})

const getUserTweets = asyncHandler(async(req, res) => {

    const {userId} = req.params

    if(!userId) {
        throw new ApiError(400, "user id not found")
    }

    const existingTweets = Tweet.find({
        owner: userId
    })
 
    if(existingTweets.length === 0) {
        return res.status(200).json(ApiResponse(200, existingTweets, "user hasn't tweeted anything yet"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, existingTweets, "user's tweets sent successfully"))
    


})

const updateTweet = asyncHandler(async(req, res) => {

    const {tweetId} = req.params
    const {newContent} = req.body

    if(!tweetId) {
        throw new ApiError(400, "user id not found")
    }

    if(!newContent) {
        throw new ApiError(400, "this field is required")
    }

    await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content: newContent
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "tweet updated successfully"))


})

const deleteTweet = asyncHandler(async(req, res) => {

    const {tweetId} = req.params

    if(!tweetId) {
        throw new ApiError(400, "tweet id not found")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "tweet deleted successfully"))


})

export {
    createTweet, 
    getUserTweets,
    updateTweet,
    deleteTweet
}