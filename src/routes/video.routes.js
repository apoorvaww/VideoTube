import { Router } from "express";

import {
    publishAVideo,
    updateVideo,
    deleteVideo
} from '../controllers/video.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/publish-a-video").post(
    verifyJWT, 
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]),
    publishAVideo
)
router.route("/update-video").post(verifyJWT, updateVideo);
router.route("/delete-video").post(verifyJWT, deleteVideo)

export default router