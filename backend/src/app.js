import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    //the origin which you are allowing to access your backend
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" })); // to accept json files.

//configuring the data which is coming from url:
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes:
import userRouter from "./routes/user.routes.js";
import commentRouter from "./routes/comment.routes.js"
import videoRouter from "./routes/video.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import likeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthCheckRouter from "./routes/healthcheck.routes.js"

//routes declaration:
app.use("/api/v1/users", userRouter);
app.use("/api/comments", commentRouter );
app.use("/api/videos", videoRouter);
app.use("/api/subscription", subscriptionRouter)
app.use("/api/like", likeRouter)
app.use("/api/tweet", tweetRouter)
app.use("/api/playlist", playlistRouter)
app.use("/api/dashboard", dashboardRouter)
app.use("/api/healthcheck", healthCheckRouter)

// http://localhost:8000/api/v1/users/register
export { app };
