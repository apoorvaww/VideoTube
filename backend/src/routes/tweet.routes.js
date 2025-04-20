import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    updateTweet,
    getUserTweets
} from "../controllers/tweet.controller.js"
import {verifyJWT} from '../middlewares/auth.middleware.js'


const router = Router()

router.route("/create-tweet").post(verifyJWT, createTweet)
router.route("/delete-tweet").post(verifyJWT, deleteTweet)
router.route("/update-tweet").post(verifyJWT, updateTweet)
router.route("/get-user-tweets").get(verifyJWT, getUserTweets)

export default router