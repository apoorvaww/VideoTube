import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getChannelStats = asyncHandler(async(req, res) => {
    // TODO: get channel stats like total video views, total subscribers, total videos, total likes etc.

    const {channelId} = req.params

    if(!channelId) {
        throw new ApiError(400, "no channel id received")
    }

    const objectId = new mongoose.Types.ObjectId(channelId)

    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: objectId
            },
            
        }, 
        {
            $group: {
                _id: null,
                totalVideos: {$sum : 1},
                totalViews: {$sum: "$views"}
            }
        }
    ])

    const {totalVideos = 0, totalViews = 0} = videoStats[0] || {};

    const totalSubscribers = await Subscription.countDocuments({
        channel: objectId
    }  );

    const totalLikes = await Like.countDocuments({
        video: {
            $in: await Video.find({
                owner: objectId
            }).distinct("_id")
        }
    })

    const stats = {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes
    }

    return res
    .status(200)
    .json(new ApiResponse(200, stats, "channel stats fetched successfully"))



})

const getChannelVideos = asyncHandler(async(req, res) => {
    // TODO: get all the videos uplaoded by user

    const {channelId} = req.params

    if(!channelId) {
        throw new ApiError(400, "user id is required")
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            },
        },
        {
            $lookup: {
                from: "user",
                localField: "owner",
                foreignField: "_id",
                as: "channelDetails"
            }
        },
        
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    if(!videos) {
        return res.status(200).json(new ApiResponse(200, videos, "user hasn't uploaded any video yet"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "channel videos fetched successfully"))
    

})


export {
    getChannelStats,
    getChannelVideos
}