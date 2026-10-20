import "dotenv/config";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  uploadImageFromUrl,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import Post from "../models/post.model.js";
import { Follow } from "../models/follow.model.js";
import { randomUUID } from "node:crypto";

const secureCookies =
  process.env.COOKIE_SECURE === "true" ||
  process.env.NODE_ENV === "production" ||
  Boolean(process.env.RENDER_EXTERNAL_URL);

const authCookieOptions = {
  httpOnly: true,
  secure: secureCookies,
  sameSite: secureCookies ? "none" : "lax",
};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend

  const { username, password, email, GithubUsername, Bio, Role } = req.body;
  // console.log(username, password, email);

  //Validation -- Not empty
  if (
    [username, email, password, Role].some((fields) => fields.trim() === "")
  ) {
    throw new ApiError(400, `${fields} is required`);
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
      "Password must contain uppercase and lowercase letters and must be at least 8 characters long.",
    );
  }

  // check if user already exits: username,email

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User Already Exits.");
  }

  // check for existing github name

  if (GithubUsername) {
    const existedGithubUsername = await User.findOne({
      GithubUsername: GithubUsername,
    });

    if (existedGithubUsername) {
      throw new ApiError(409, "Github username Already Exits.");
    }
  }

  const avatarLocalPath = req.files?.avatarImage?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required!");
  }

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
    Role,
  });

  //Generate Tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id,
  );

  // remove password, refreshToken fiels from response

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // check for user creation

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user  ",
    );
  }
  const options = authCookieOptions;
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
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = authCookieOptions;

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
        "User logged In Successfully",
      ),
    );
});

const createUniqueUsername = async (profile) => {
  const baseUsername = (profile.displayName || profile.emails?.[0]?.value?.split("@")[0] || "google-user")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24) || "google-user";

  let username = baseUsername;
  let suffix = 1;
  while (await User.exists({ username })) {
    username = `${baseUsername.slice(0, 24 - String(suffix).length - 1)}_${suffix}`;
    suffix += 1;
  }
  return username;
};

const isCloudinaryUrl = (imageUrl) =>
  typeof imageUrl === "string" && imageUrl.includes("res.cloudinary.com/");

const getOAuthAvatarUrl = async (avatar) => {
  const cloudinaryAvatar = await uploadImageFromUrl(avatar);

  if (!cloudinaryAvatar) {
    throw new ApiError(502, "Unable to save OAuth profile image");
  }

  return cloudinaryAvatar;
};

const googleLogin = asyncHandler(async (req, res) => {
  const profile = req.user;
  const email = profile.emails?.[0]?.value?.toLowerCase();
  const avatar = profile.photos?.[0]?.value;

  if (!email || !avatar) {
    throw new ApiError(400, "Google did not provide an email address and profile photo");
  }

  let user = await User.findOne({
    $or: [{ googleId: profile.id }, { email }],
  });

  if (!user) {
    user = await User.create({
      googleId: profile.id,
      username: await createUniqueUsername(profile),
      email,
      password: randomUUID(),
      AvatarImage: await getOAuthAvatarUrl(avatar),
      Role: "user",
    });
  } else {
    let changed = false;
    if (!user.googleId) {
      user.googleId = profile.id;
      changed = true;
    }
    if (!isCloudinaryUrl(user.AvatarImage)) {
      user.AvatarImage = await getOAuthAvatarUrl(avatar);
      changed = true;
    }
    if (changed) {
      await user.save({ validateBeforeSave: false });
    }
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  const frontendUrl = process.env.GOOGLE_SUCCESS_REDIRECT || process.env.CORS_ORIGIN;

  if (!frontendUrl) {
    throw new ApiError(500, "GOOGLE_SUCCESS_REDIRECT or CORS_ORIGIN is required");
  }

  return res
    .cookie("accessToken", accessToken, authCookieOptions)
    .cookie("refreshToken", refreshToken, authCookieOptions)
    .redirect(`${frontendUrl.replace(/\/$/, "")}/oauth/google/callback`);
});

const githubLogin = asyncHandler(async (req, res) => {
  const profile = req.user;
  const email = profile.emails?.find((item) => item.value)?.value?.toLowerCase();
  const avatar = profile.photos?.[0]?.value;
  const githubUsername = profile.username;

  if (!email || !avatar || !githubUsername) {
    throw new ApiError(400, "GitHub did not provide the required profile information");
  }

  let user = await User.findOne({
    $or: [{ githubId: profile.id }, { email }],
  });

  if (!user) {
    user = await User.create({
      githubId: profile.id,
      GithubUsername: githubUsername,
      username: await createUniqueUsername(profile),
      email,
      password: randomUUID(),
      AvatarImage: await getOAuthAvatarUrl(avatar),
      Role: "developer",
    });
  } else {
    let changed = false;
    if (!user.githubId) {
      user.githubId = profile.id;
      changed = true;
    }
    if (!user.GithubUsername) {
      user.GithubUsername = githubUsername;
      changed = true;
    }
    if (user.Role !== "developer") {
      user.Role = "developer";
      changed = true;
    }
    if (!isCloudinaryUrl(user.AvatarImage)) {
      user.AvatarImage = await getOAuthAvatarUrl(avatar);
      changed = true;
    }
    if (changed) {
      await user.save({ validateBeforeSave: false });
    }
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  const frontendUrl = process.env.GITHUB_SUCCESS_REDIRECT || process.env.CORS_ORIGIN;

  if (!frontendUrl) {
    throw new ApiError(500, "GITHUB_SUCCESS_REDIRECT or CORS_ORIGIN is required");
  }

  return res
    .cookie("accessToken", accessToken, authCookieOptions)
    .cookie("refreshToken", refreshToken, authCookieOptions)
    .redirect(frontendUrl);
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
    },
  );

  return res
    .clearCookie("accessToken", authCookieOptions)
    .clearCookie("refreshToken", authCookieOptions)
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
      process.env.REFRESH_TOKEN_SECRET,
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

    return res
      .status(200)
      .cookie("accessToken", accessToken, authCookieOptions)
      .cookie("refreshToken", newRefreshToken, authCookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "access Token refreshed",
        ),
      );
  } catch (error) {
    res
      .clearCookie("accessToken", authCookieOptions)
      .clearCookie("refreshToken", authCookieOptions);
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const getAllDevs = asyncHandler(async (req, res) => {
  try {
    const allDevs = await User.find({});
    // console.log("Devs", allDevs);
    return res.json(new ApiResponse(200, allDevs));
  } catch (error) {
    throw new ApiError(400, "Could not fetch devs.");
  }
});

const getFeaturedDevs = asyncHandler(async (req, res) => {
  try {
    const featured = await User.aggregate([
      { $match: { Role: "developer" } },
      { $sample: { size: 4 } },
    ]); // get random 4 devs
    return res.json(new ApiResponse(200, featured));
  } catch (error) {
    throw new ApiError(400, "Could not fetch devs.");
  }
});

const getProfile = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "-password -refreshToken -email ",
    );
    if (!user) {
      throw new ApiError(400, "User Does not exists.");
    }
    return res.json(new ApiResponse(200, user));
  } catch (error) {
    throw new ApiError(400, "Could not fetch user.");
  }
});
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken",
    );

    console.log("User in profile ---", user)
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.json(
      new ApiResponse(200, user, "Current user profile fetched successfully"),
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching current user profile");
  }
});

const deleteCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await Post.deleteMany({ author: userId });

  await Post.updateMany(
    { author: { $ne: userId } },
    {
      $pull: {
        likes: userId,
        comments: { user: userId },
      },
    },
  );

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .clearCookie("accessToken", authCookieOptions)
    .clearCookie("refreshToken", authCookieOptions)
    .json(new ApiResponse(200, {}, "User account deleted successfully"));
});

const followUserController = asyncHandler(async (req, res) => {
  const followerId = req.user?._id;
  const followeeId = req.params.userId;

  const isFolloweeExists = await User.findById(followeeId);

  if (!isFolloweeExists) {
    throw new ApiError(400, "User Does not exists.");
  }

  if (followerId.toString() === followeeId) {
    throw new ApiError(400, "You can't follow yourself");
  }

  const isAlreadyFollowing = await Follow.findOne({
    follower: followerId,
    followee: followeeId,
  });

  if (isAlreadyFollowing) {
    throw new ApiError(400, "You already follow this user.");
  }

  const followRecord = await Follow.create({
    follower: followerId,
    followee: followeeId,
  });

  return res.json(new ApiResponse(201, followRecord, `You are following `));
});

const unfollowUserController = asyncHandler(async (req, res) => {
  const followerId = req.user._id;
  const followeeId = req.params.userId;

  const isFollowing = await Follow.findOne({
    follower: followerId,
    followee: followeeId,
  });

  if (!isFollowing) {
    throw new ApiError(400, "You don't follow this user");
  }

  await Follow.findByIdAndDelete(isFollowing._id);

  return res.json(new ApiResponse(200, {}, "User unfollowed"));
});

const getFollowRecord = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const isUserExists = await User.findById(userId);

  if (!isUserExists) {
    throw new ApiError(400, "User does not exists.");
  }

  const followingRecord = await Follow.find({ follower: userId });
  const followerRecord = await Follow.find({ followee: userId });

  return res.json(new ApiResponse(200, { followerRecord, followingRecord }));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getFeaturedDevs,
  getAllDevs,
  getCurrentUserProfile,
  getProfile,
  deleteCurrentUser,
  followUserController,
  unfollowUserController,
  getFollowRecord,
  googleLogin,
  githubLogin,
};
