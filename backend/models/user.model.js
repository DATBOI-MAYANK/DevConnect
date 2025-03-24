import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    AvatarImage: {
      type: String,
      required: true,
    },
    CoverImage: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    // console.log("Password modified:", this.isModified("password"));
    if (this.isModified("password")) {
      // console.log("Before hashing:", this.password);
      this.password = await bcrypt.hash(this.password, 10);
      // console.log("After hashing:", this.password);
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  const result = await bcrypt.compare(password, this.password);

  return result;
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
    // console.log("Access Token Secret:", process.env.ACCESS_TOKEN_SECRET)

  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
    // console.log("Refresh Token Secret:", process.env.REFRESH_TOKEN_SECRET)

  );
};

export const User = mongoose.model("User", UserSchema);
