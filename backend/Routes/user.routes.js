import { Router } from "express";
import {
  getFeaturedDevs,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getAllDevs,
  getCurrentUserProfile,
  getProfile,
  deleteCurrentUser,
  followUserController,
  unfollowUserController,
  getFollowRecord,
  getUserFollowRecord,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/api/v1/register").post(
  upload.fields([
    {
      name: "avatarImage",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/api/v1/login").post(loginUser);

router.route("/api/v1/me").get(verifyJwt, getCurrentUserProfile);

router.route("/api/v1/profile/:userId").get(getProfile);

router.route("/api/v1/featured").get(getFeaturedDevs);

router.route("/api/v1/devs").get(getAllDevs);

router.route("/api/v1/logout").post(verifyJwt, logoutUser);

router.route("/api/v1/delete-account").delete(verifyJwt, deleteCurrentUser);

router.route("/api/v1/refresh-Token").post(refreshAccessToken);

router.route("/api/v1/follow/:userId").post(verifyJwt, followUserController);

router.route("/api/v1/unfollow/:userId").delete(verifyJwt, unfollowUserController);

router.route("/api/v1/follow-record").get(verifyJwt, getFollowRecord);

router.route("/api/v1/user-follow-record/:userId").get(getUserFollowRecord);

export default router;
