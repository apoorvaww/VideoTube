import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt  from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    // user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}

  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  //get user details from the frontend
  //validation - not empty (checking if required fields are filled by user or not )
  //check if user already exists: using username, email
  //check for images, check for avatar
  //upload the images to cloudinary
  //cloudinary gives back url and then create user object - create entry in database.
  //when user is created and response is received, we need to remove password and refresh token field from that response to send it back to frontend
  // check if user is created successfully or not
  // if user is created then return response

  //STEP 1: form/json se mila hua data seedha body me mil jaega.
  // console.log(req.files);
  const { fullName, email, username, password } = req.body;
  // console.log(req.body);
  // console.log("email: ", email);

  //validation:
  //   if (fullName === "") {
  //     throw new ApiError(400, "Full Name is required");
  //   }

  //some returns true if the condition in callback is true for any field in the array.
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are compulsory");
  }

  //finding the username by either email or username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //the files is added by the multer in here:
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImagePath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }
  
  if(!avatarLocalPath)  {
    throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadCloudinary(avatarLocalPath)
  const coverImage = await uploadCloudinary(coverImageLocalPath)

  if(!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "user registered successfully.")
  )

  // res.status(200).json({
  //     message: "chai aur backend"
  // })
});


const loginUser = asyncHandler(async (req, res) => {
  // take data from req.body
  // login using either email or username
  // find the user.. if it exists or not
  // check if the password entered is correct or not
  // if correct.. generate access and refresh token.
  // send these tokens using cookies.

  const {email, username, password} = req.body

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required")
  }

  const user = await User.findOne({
    $or: [{username}, {email}]
  })

  if(!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await  user.isPasswordCorrect(password);

  if(!isPasswordValid) {
    throw new ApiError(401, "password is incorrect");
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  //cookies bhejne se pehle you need to create an object - options:
  const options = {
    httOnly: true,
    secure: true
  }
  //this way the cookies can't be accessed via the front-end part but the browser only

  return res
    .status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200, 
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User loggedi in successfully."
      )
    )
  
})

const logoutUser = asyncHandler(async(req, res) => {
  // to logout a user you can either the cookies stored for that user
  // or you can also reset the access token and refresh token
  await User.findByIdAndUpdate(
    req.user._id,
    {
      // update krna kya hai? jo refresh token mila hai hmein use delete krna hai.
      $set: {
        refreshToken: undefined
      }
    }, 
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken = asyncHandler(async(req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken //req.body.refreshToken is for the mobile app users

  if(!incomingRefreshToken) {
    throw new ApiError(401, "unoauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
    const user = await User.findById(decodedToken?._id)
  
    if(!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "Refresh Token has expired or used");
    }
  
  
    const options = {
      httpOnly: true,
      secure: true
    }
  
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken: newRefreshToken},
        "Access token refreshed"
      )
    )
  } catch (error) {
    console.log(error);
    throw new ApiError(401, error?.message || "invalid refresh token")
  }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
  const {oldPassword, newPassword} = req.body
  
  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if(!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }


  user.password = newPassword
  await user.save({validateBeforeSave: false});

  return res
  .status(200)
  .json(new ApiResponse(
    200,
    {},
    "Password changed successfuly"
  ))

})


const getCurrentUser = asyncHandler(async(req, res) => {

  return res
  .status(200)
  .json(200, req.user, "Current user fetched successfully")
})


const updateAccountDetails = asyncHandler(async(req, res)=>{
  const {fullName, email, username} = req.body;
  // agar koi file update krvani hai to uske liye totally different controller rkhna chaiye.

  if(!fullName || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email
      }
    },
    {new: true} // update hone ke baad jo information hogi vo return hogi
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account details updated successfully"))

})


const updateUserAvatar = asyncHandler(async(req, res) => {
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is missing")
  }
  //bina database pe upload kiye directly cloudinary pe upload kr skte hain 
  const avatar = await uploadCloudinary(avatarLocalPath)

  if(!avatar.url) {
    throw new ApiError(400, "Error while uploading the avatar")
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {new: true}
  ).select("-password")

})


const updateUserCoverImage = asyncHandler(async(req, res) => {
  const coverImageLocalPath = req.file?.path
  
  if(!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const coverImage = await uploadCloudinary(coverImageLocalPath)

  if(!coverImage.url){
    throw new ApiError(400, "Error while uploading cover image")
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      coverImage: coverImage.url
    },
    {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200, user, "cover image updated successfully")
  )

})



export { 
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage
};
