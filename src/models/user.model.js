import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // if you want a field to be searchable easily then make index as true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // uploading image on cloudinary which will return back an url of the images
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        //this will require a npm package mongoose-aggregate-paginate-2
        //this will help us write the aggregation pipelines for mongodb
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true || "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//not using a arrow function in the callback below because the arrow function doesn't have any access to "this" and to run this hook, we will be needing that.
// the next parameter here has access to the next middleware function. it passes control to the next middleware function in the stack.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//making custom method:
// we are making this method so we are able to compare the user's password with whatever is stored in the db but since we are storing encrypted password in the db, we have to make a different function for that.
//but this is cryptography and computation power is required so we need to use await.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//custom method for generating access token
// we need to send payload, access token and the duration inwhich it expires
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id, // from mongoDb
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = new mongoose.model("User", userSchema);
