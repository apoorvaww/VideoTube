import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)


/// secured routes: user logged in hoga tbhi ye routes kaam krenge
router.route("/logout").post(verifyJWT, logoutUser)
// line 26 me verifyJWT pehle likha hai kyuki usme middleware ka use kiya gya hai. verifyJWT function pehle middleware ke paas jaega jisme next() hai jo next function logoutUser ko middleware pe send krega
router.route("/refresh-token").post(refreshAccessToken)

export default router;
