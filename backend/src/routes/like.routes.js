import { 
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike
} from "../controllers/like.controller.js";
import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/toggle-comment-like/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/toggle-tweet-like/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/toggle-video-like/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/get-liked-videos").post(verifyJWT, getLikedVideos);

export default router;