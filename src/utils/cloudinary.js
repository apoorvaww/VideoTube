import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config();

// console.log("cloudinary api key: ",process.env.CLOUDINARY_API_KEY)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadCloudinary = async (localFilePath) => {
  console.log(localFilePath)
  try {
    if (!localFilePath) return;
    //uploading the file:
    const response = await cloudinary.uploader.upload(localFilePath, { 
      resource_type: "auto",
    });

    //console.log(response)
    //file has been successfully uploaded:
    // console.log("File is uploaded on cloudinary. ", response.url);
    fs.unlinkSync(localFilePath); //remove the files stored locally on your server as the upload on cloudinary is successful.
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the files stored locally on your server as the upload on cloudinary is successful.
    console.error("coudinary upload failed", error);
    return null;
  }
};


export {uploadCloudinary}