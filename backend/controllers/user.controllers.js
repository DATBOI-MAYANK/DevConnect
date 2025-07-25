import "dotenv/config";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log("User found:", user);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // console.log("Access Token:", accessToken);
    // console.log("Refresh Token:", refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log("User after saving refreshToken:", user);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend

  const { username, password, email, GithubUsername, Bio } = req.body;
  // console.log(username, password, email);

  //Validation -- Not empty
  if (
    [username, email, password, GithubUsername].some(
      (fields) => fields.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Fields are required !!");
  }
  if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
    throw new ApiError(400, "Ivalid Email");
  }
  // Password Edgecases
  const maxBytes = 72;
  const passwordByteLength = Buffer.from(password).length;
  const commonPasswords = new Set(["pass", "password", "12345", "qwerty"]);

  if (typeof password !== "string" || password.trim().length === 0) {
    throw new ApiError(400, "Password must contain non-whitespace characters");
  }
  if (passwordByteLength > maxBytes) {
    throw new ApiError(400, "Password exceeds safe length limits");
  }
  if (commonPasswords.has(password.toLowerCase())) {
    throw new ApiError(400, "Password is too common");
  }
  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    password.length < 8
  ) {
    throw new ApiError(
      400,
      "Password must contain uppercase and lowercase letters and must be at least 8 characters long."
    );
  }

  // check if user already exits: username,email

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User Already Exits.");
  }

  // check for images: check for avatar
  // console.log("Avatar==>",req.files?.avatarImage?.[0]?.path )
  const avatarLocalPath = req.files?.avatarImage?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;
  // console.log("avatarpath---" , avatarLocalPath)
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required!");
  }

  // upload them to cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);
  // console.log("cloudAvatr----", avatar);

  if (!avatar) {
    throw new ApiError(400, "Avatar File is required!");
  }

  // create user object -- create entry in db
  const user = await User.create({
    username: username,
    AvatarImage: avatar,
    CoverImage: coverImage || "",
    email,
    password,
    GithubUsername,
    Bio,
  });

  //Generate Tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

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
  const options = {
    httpOnly: true,
    secure: true,
  };
  // return res

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email , password);

  if (!email && !password) {
    throw new ApiError(400, "All Fields are required. !!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist. !");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  // console.log("password----" , isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect. !");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
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
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const getFeaturedDevs = asyncHandler(async (req, res) => {
  try {
    const featured = await User.aggregate([{ $sample: { size: 4 } }]); // get random 4 devs
    return res.json(new ApiResponse(200, featured));
  } catch (error) {
    throw new ApiError(400, "Could not fetch devs.");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getFeaturedDevs,
};
