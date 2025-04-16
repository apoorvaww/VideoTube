import { Router } from "express";
import {
    getVideoComments,
    updateComment,
    deleteComment,
    addComment
} from '../controllers/comment.controller'
import { verifyJWT } from "../middlewares/auth.middleware";


const router = Router();

router.route("/get-video-comments").get(verifyJWT, getVideoComments)
router.route("/update-comment").post(verifyJWT, updateComment)
router.route("/delete-comment").post(verifyJWT, deleteComment)
router.route("/add-comment").post(verifyJWT, addComment)


export default router