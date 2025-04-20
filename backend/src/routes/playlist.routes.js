import { 
    createPlaylist,
    getPlaylistById,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist);
router.route("/get-playlist-by-id/:playlistId").get(verifyJWT, getPlaylistById);
router.route("/get-users-playlists/:userId").get(verifyJWT, getUserPlaylists);
router.route("/add-video-to-playlist/:playlistId/:videoId").post(verifyJWT, getLikedVideos);
router.route("/remove-video-from-playlist/:playlistId/:videoId").post(verifyJWT, removeVideoFromPlaylist)
router.route("/delete-playlist/:playlistId").post(verifyJWT, deletePlaylist)
router.route("/update-playlist/:playlistId").post(verifyJWT, updatePlaylist)

export default router;