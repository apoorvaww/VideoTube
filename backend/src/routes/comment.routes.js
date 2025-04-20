import { Router } from "express";
import {
    getVideoComments,
    updateComment,
    deleteComment,
    addComment
} from '../controllers/comment.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/get-video-comments/:videoId").get(verifyJWT, getVideoComments)
router.route("/update-comment/:commentId").post(verifyJWT, updateComment)
router.route("/delete-comment/:commentId").post(verifyJWT, deleteComment)
router.route("/add-comment/:videoId").post(verifyJWT, addComment)


export default router