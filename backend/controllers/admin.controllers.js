import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerAdmin = asyncHandler(async (req, res) => {
  // get admin details from frontend

  const { Adminname, password, email } = req.body;

  //Validation -- Not empty

  if ([Adminname, email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "All Fields are required !!");
  }
  if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
    throw ApiError(400, "Ivalid Email");
  }

  // check if Admin already exits: Adminname,email

  const existedAdmin = await Admin.findOne({
    $or: [{ Adminname }, { email }],
  });

  if (existedAdmin) {
    throw new ApiError(409, "Admin Already Exits.");
  }

  // check for images: check for avatar

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.cover?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required!");
  }

  // upload them to cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar File is required!");
  }

  // create Admin object -- create entry in db

  const admin = await Admin.create({
    Adminname: Adminname.toLowerCase(),
    AvatarImage: avatar.url,
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

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "All Fields are required. !!");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(404, "Admin does not exist. !");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Passoword incorrect. !");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("Access Token", accessToken, options)
    .cookie("Refresh Token", refreshToken, options)
    .json(200, {
      admin: accessToken,
      loggedInAdmin,
      refreshToken,
    },
    "Admin logged in succesfully."
  );
});

export { registerAdmin, loginAdmin };
