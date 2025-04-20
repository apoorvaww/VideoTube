// require('dotenv').config({path: './env'})
//the require statement disrupts the code consistency

// import mongoose from "mongoose";
// import {DB_NAME} from './constants'

import dotenv from 'dotenv'
import connectDB from "./db/index.js";

import {app} from './app.js'

dotenv.config({
    path: './.env'
})


connectDB()
.then(()=> {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO DB connection failed!! ", err)
})





// first approach to connect a database is to create an iffy in the index.js file itself. 
// another approach is to connect a database in a different file and then importing it into index file

/*
import express, { application } from 'express'

// this is an iffy, the code written here will get immediately executed, there's no need for a function call
const app =express()

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // the app from express is used here for event listener and it's listening for errors:
        app.on("error",(error)=>{
            console.log("ERR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port: ", ${process.env.PORT}`)
        })
        
    } catch (error) {
        console.error("ERROR: ", error);
        throw error
        
    }
})()
*/