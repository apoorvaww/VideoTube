import mongoose,{isValidObjectId} from "mongoose";
import { User } from "../models/user.model";
import { Video } from "../models/video.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadCloudinary } from "../utils/cloudinary";


const getAllVideos = asyncHandler(async(req, res) => {
    const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query
    // todo: get all videos based on query, sort, pagination


})


const publishAVideo = asyncHandler(async(req, res) => {
    const {title, description} = req.body
    // TODO: get video, upload to cloudinary and create a video
    // get the video from req.files and then upload it to cloudinary using multer and then get url. 
    // save title description, and url and then return success response
    const videoFilePath = req.files?.videoFile[0]?.path;
    const thumbnailPath = req.files?.thumbnail[0]?.path;
    
    if(!videoFilePath) {
        throw new ApiError(400, "Video file is required")
    }

    if(!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const videoFile = await uploadCloudinary(videoFilePath)
    const thumbnailFile = await uploadCloudinary(thumbnailPath)

    if(!videoFile) {
        throw new ApiError(400, "Video is required")
    }

    if(!thumbnailFile) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnailFile.url,
        title,
        description,
    })

})


const updateVideo = asyncHandler(async(req, res) => {
    const {videoId} = req.params
    // TODO: update video details like title, description, thumbnail
    if(!videoId) {
        throw new ApiError(400, "video id not found")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(400, "no such video exists")
    }

    // const thumbnailPath = req.files?.thumbnail[0]?.path

    // if(!thumbnailPath) 


})

const deleteVideo = asyncHandler(async(req, res) => {
    const {videoId} = req.params
    // TODO: delete video
})

const togglePublishStatus = asyncHandler(async(req, res) => {
    const {videoId} = req.params
})


export {
    getAllVideos,
    updateVideo,
    deleteVideo,
    togglePublishStatus, 
    publishAVideo
}