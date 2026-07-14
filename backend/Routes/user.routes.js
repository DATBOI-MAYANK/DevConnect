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

router.route("/login").post(loginUser);
router.route("/api/v1/login").post(loginUser);

router.route("/me").get(verifyJwt, getCurrentUserProfile);
router.route("/api/v1/me").get(verifyJwt, getCurrentUserProfile);

router.route("/profile/:userId").get(getProfile);
router.route("/api/v1/profile/:userId").get(getProfile);

router.route("/featured").get(getFeaturedDevs);
router.route("/api/v1/featured").get(getFeaturedDevs);

router.route("/devs").get(getAllDevs);
router.route("/api/v1/devs").get(getAllDevs);

router.route("/logout").post(verifyJwt, logoutUser);
router.route("/api/v1/logout").post(verifyJwt, logoutUser);

router.route("/delete-account").delete(verifyJwt, deleteCurrentUser);
router.route("/api/v1/delete-account").delete(verifyJwt, deleteCurrentUser);

router.route("/refresh-Token").post(refreshAccessToken);
router.route("/api/v1/refresh-Token").post(refreshAccessToken);

export default router;
