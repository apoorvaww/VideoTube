import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const healthCheck = asyncHandler(async(req, res) => {
    // TODO: build a healthcheck response that simply return ok status as json with a message
    const dbStatus = mongoose.connection.readyState === 1? "Connected" : "Disconnected"

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            server: "OK",
            database: dbStatus,
            uptime: process.uptime,
            timestamp: new Date(),
        }, "Health check passed")
    )
})


export {
    healthCheck
}