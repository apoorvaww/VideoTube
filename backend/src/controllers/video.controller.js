import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadCloudinary,
  uploadVideoOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // todo: get all videos based on query, sort, pagination

  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary and create a video
  // get the video from req.files and then upload it to cloudinary using multer and then get url.
  // save title description, and url and then return success response
  const videoFilePath = req.files?.videoFile[0]?.path;
  const thumbnailPath = req.files?.thumbnail[0]?.path;

  if (!videoFilePath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoFile = await uploadVideoOnCloudinary(videoFilePath);
  const thumbnailFile = await uploadCloudinary(thumbnailPath);

  if (!videoFile) {
    throw new ApiError(400, "Video is required");
  }

  if (!thumbnailFile) {
    throw new ApiError(400, "Thumbnail is required");
  }

  // const duration = videoFile.ass

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnailFile.url,
    title,
    description,
    duration: videoFile.duration,
    owner: req.user?.id,
  });

  const uploadedVideo = await Video.findById(video._id);

  if (!uploadedVideo) {
    throw new ApiError(500, "Something went wrong while uploading the video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, uploadedVideo, "Video uploaded successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: update video details like title, description, thumbnail
  if (!videoId) {
    throw new ApiError(400, "video id not found");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  if (video.owner.toString() !== req.user) {
    trho;
  }

  const { title, description } = req.body;

  // const newVideoFilePath = req.files?.videoFile[0]?.path
  const newThumbnailPath = req.files?.thumbnail[0]?.path;

  if (newThumbnailPath) {
    const newThumbnail = await uploadCloudinary(newThumbnailPath);
    video.thumbnail = newThumbnail.url;
  }

  // this would've been done if you want title and description to be edited mandatorily
  // if(!title) {
  //     throw new ApiError(400, "Title field is required");
  // }

  // if(!description) {
  //     throw new ApiError(400)
  // }

  if (title) {
    video.title = title;
  }

  if (description) {
    video.description = description;
  }

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  // TODO: delete video
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id not found");
  }

  const video = Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  if (video.owner.toString() !== req.user) {
    throw new ApiError(400, "You are not authorised to delete the video");
  }

  await video.findByIdAndDelete(video._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// TODO: COMPLETE THE CONTROLLER BELOW:
// const togglePublishStatus = asyncHandler(async(req, res) => {
//     const {videoId} = req.params
// })

const getVideoById = asyncHandler(async(req, res) => {
  const {videoId} = req.params;

  const video = await Video.findById(videoId).populate("owner", "username fullName, avatar")

  if(!video) {
    throw new ApiError(404, "video not found")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, video, "video sent successfully"))

})

export {
  // getAllVideos,
  updateVideo,
  deleteVideo,
  // togglePublishStatus,
  publishAVideo,
  getVideoById
};
