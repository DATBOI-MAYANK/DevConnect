import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerAdmin = asyncHandler(async (req, res) => {
  // get admin details from frontend

  const { username, password, email } = req.body;

  //Validation -- Not empty

  if ([username, email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "All Fields are required !!");
  }
  if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
    throw ApiError(400, "Ivalid Email");
  }

  // check if user already exits: username,email

  const existedAdmin = Admin.findOne({
    $or: [{ username }, { email }],
  });

  if (existedAdmin) {
    throw new ApiError(409, "Admin Already Exits.");
  }

  // check for images: check for avatar

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.cover[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required!");
  }

  // upload them to cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar File is required!");
  }

  // create user object -- create entry in db

  const admin = await Admin.create({
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  // remove password, refreshToken fiels from response

  const createdAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  // check for admin creation

  if (!createdAdmin) {
    throw new ApiError(
      500,
      "Something went wrong while registering the admin  "
    );
  }

  // return res

  return res
    .status(200)
    .json(new ApiResponse(200, createdAdmin, "Admin registered successfully"));
});

export { registerAdmin };
