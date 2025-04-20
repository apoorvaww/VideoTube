import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        //connection variable is holding the response after database connection
        // console.log(process.env);
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        
        console.log(
            `\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host} `
        );
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
        //process is the reference of the current application
    }
};


export default connectDB