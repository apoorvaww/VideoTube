import mongoose from "mongoose";
import {Playlist} from '../models/playlist.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video, Video } from "../models/video.model.js";


const createPlaylist = asyncHandler(async(req, res) => {
    /// TODO: CREATE Playlist
    const {name, description} = req.body
    const {userId} = req.body || req.user?._id

    if(!name) {
        throw new ApiError(400, "name of the playlist is required")
    }

    if(!description) {
        throw new ApiError(400, "description of the playlist is required")
    }

    if(!userId) {
        throw new ApiError(400, "userid is needed to create playlist")
    }

    const playlist = await Playlist.create({
        name: name,
        description: description,
        owner: userId
    })

    if(!playlist) {
        throw new ApiError(500, "something went wrong")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created successfully"))


})


const getUserPlaylists = asyncHandler(async(req, res) => {

    const {userId} = req.params

    if(!userId) {
        throw new ApiError(400, "user id not found")
    }

    const playlists = await Playlist.find({
        owner: userId
    })

    if(playlists.length === 0) {
        return res.status(200).json(new ApiResponse(200, playlists, "user hasn't created any playlist yet"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, "user's playlists sent successfully"))


})

const getPlaylistById = asyncHandler(async(req, res) => {

    const {playlistId} = req.params

    if(!playlistId) {
        throw new ApiError(400, "no playlist id found")
    }

    const playlist = await Playlist.findById(playlistId).populate("video")

    if(!playlist) {
        throw new ApiError(404, "no such playlist found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"))

})

const addVideoToPlaylist = asyncHandler(async(req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId) {
        throw new ApiError(400, "no playlist id found")
    }

    if(!videoId) {
        throw new ApiError(400, "no video id found")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError(404, "no such playlist found")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "no such video exists")
    }

    if(playlist.videos.includes(videoId)) {
        throw new ApiError(409, "video already exists in playlist")
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res
    .status(201)
    .json(new ApiResponse(201, playlist, "video added to playlist successfully"))

})


const removeVideoFromPlaylist = asyncHandler(async(req, res) => {
    const {playlistId, videoId} = req.params
    const {userId} = req.body

    if(!playlistId || !videoId){
        throw new ApiError(" playlistid or videoid not received")
    }

    if(!userId) {
        throw new ApiError("user id not found")
    }

    const playlist = Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError(400, "playlist not found")
    }

    const video = Video.findById(videoId)

    if(!video) {
        throw new ApiError(400, "video not found")
    }

    if(playlist.owner.toString() !== userId) {
        throw new ApiError(401, "you are not authorized to perform this operation")
    }

    playlist.videos = playlist.videos.filter(
        (vid) => vid.toString() !== videoId
    )


    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "video removed from playlist successfully"))


})

const deletePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params
    const {userId} = req.body

    if(!playlistId) {
        throw new ApiError(400, "no playlist id provided")
    }

    const playlist = await Playlist.findById(playlistId)
    
    if(!playlist) {
        throw new ApiError(404, "no such playlist found")
    }

    if(playlist.owner.toString() !== userId) {
        throw new ApiError(401, "you are not authorized to delete this playlist")
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
    .status(200)
    .json(200, {}, "playlist deleted successfully")

})

const updatePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params
    const {name, description, userId} = req.body
    
    if(!playlistId) {
        throw new ApiError(400, "no playlist id found")
    }

    if(!userId) {
        throw new ApiError(400, "no user id found")
    }

    if(!name || !description) {
        throw new description(400, "name and description fields are required")
    }

    const playlist = await Playlist.findById(playlistId)

    if(playlist.owner.toString() !== userId) {
        throw new ApiError(401, "you are not authorized to update the playlist")
    }

    await Playlist.findByIdAndUpdate({
        name: name,
        description: description,
    })

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist updated successfully"))


})


export {
    createPlaylist,
    getPlaylistById,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
