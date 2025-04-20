import { Router } from "express";
import {
    getChannelStats,
    getChannelVideos
} from '../controllers/dashboard.controller.js'

const router = Router()

router.route("/get-channel-stats").get(getChannelStats)
router.route("/get-channel-videos").get(getChannelStats)

export default router;