import mongoose, {isValidObjectId} from "mongoose";
import {User} from '../models/user.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"


const toggleSubsscription = asyncHandler(async(req, res) => {
    const {channelId} = req.params
    const {subscriberId} = req.body

    if(!channelId) {
        throw new ApiError(400, "no channel id found")
    }

    console.log(channelId)

    if(!subscriberId) {
        throw new ApiError(400, "no subscriber's id found")
    }

    // console.log(subscriberId)


    if(channelId === subscriberId) {
        throw new ApiError(401, "you cannot subscribe to your own channel")
    }
    
    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    // console.log("Existing subscription: ", existingSubscription)

    let message = ""

    if(existingSubscription) {
        await Subscription.deleteOne(existingSubscription);
        message = "Unsubscribed successfully"
    }
    else{
        await Subscription.create({
            channel: channelId, 
            subscriber: subscriberId
        });
        message = "Subscribed successfully";
    }

    return res
    .status(200)
    .json(new ApiResponse(200, existingSubscription, message))


})

const getUserChannelSubscribers = asyncHandler(async(req, res) => {
    // we have to find the subscribers of a particular channel by sending the channel's id in the request's params
    const {channelId} = req.params

    if(!channelId) {
        throw new ApiError(400, "channel id not found")
    }

    const subscribersList = await Subscription.find({
        channel: channelId
    }).populate("subscriber", "fullName avatar")

    if(subscribersList.length === 0) {
        return res.status(200).json(new ApiResponse(200, "zero subscribers of this channel found"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, subscribersList, "got list of subscribers successfully"))

})

const getSubscribedChannels = asyncHandler(async(req, res) => {
    // using this function we have to find out the number of channels a particular user has subscribed to
    const {subscriberId} = req.params

    if(!subscriberId) {
        throw new ApiError(400, "no subscriber's id found")
    }

    const channelsSubscribedByUser = await Subscription.find({
        subscriber: subscriberId
    }).populate("channel", "username avatar")

    if(channelsSubscribedByUser.length === 0) {
        return res.status(200).json(new ApiResponse(200, channelsSubscribedByUser, "user hasn't subscribed to anyone yet"))
    }

    const count = channelsSubscribedByUser.length

    return res
    .status(201)
    .json(new ApiResponse(
        200, 
        {
            count,
            channelsSubscribedByUser, 
        },
        "got the list of channels subscribed by user successfully"
    ))

})

export {
    toggleSubsscription, 
    getUserChannelSubscribers,
    getSubscribedChannels
}