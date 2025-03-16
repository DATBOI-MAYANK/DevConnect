import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefreshToken } from "../utils/Access&RefreshToken.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend

  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.files);

  const { username, password, email } = req.body;

  //Validation -- Not empty

  if ([username, email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "All Fields are required !!");
  }
  if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
    throw ApiError(400, "Ivalid Email");
  }

  // check if user already exits: username,email

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User Already Exits.");
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

  // create user object -- create entry in db

  const user = await User.create({
    username: username.toLowerCase(),
    AvatarImage: avatar.url,
    CoverImage: coverImage?.url || "",
    email,
    password,
  });

  // remove password, refreshToken fiels from response

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user  "
    );
  }

  // return res

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "All Fields are required. !!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist. !");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Passoword incorrect. !");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
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
      user: accessToken,
      loggedInUser,
      refreshToken,
    },
    "User logged in succesfully."
  );
});

export { registerUser, loginUser };
