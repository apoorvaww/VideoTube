import { 
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    totalLikesOnVideo,
    totalLikesOnComment
} from "../controllers/like.controller.js";
import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/toggle-comment-like/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/toggle-tweet-like/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/toggle-video-like/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/get-liked-videos").get(verifyJWT, getLikedVideos);
router.route("/total-likes-on-video/:videoId").get(totalLikesOnVideo )
router.route("/total-likes-on-comment/:commentId").get(totalLikesOnComment)

export default router;