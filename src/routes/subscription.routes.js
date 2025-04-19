import { Router } from "express";
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubsscription
} from '../controllers/subscription.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/toggle-subscription/:channelId").post(verifyJWT, toggleSubsscription)
router.route("/subscribed-channels/:subscriberId").get(verifyJWT, getSubscribedChannels)
router.route("/user-channel-subscribers/:channelId").get(verifyJWT, getUserChannelSubscribers)



export default router