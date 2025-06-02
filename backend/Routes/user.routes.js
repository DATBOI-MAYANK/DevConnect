import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
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
  registerUser
);

router.route("/api/v1/login").post(loginUser);

router.route("/api/v1/logout").post(verifyJwt, logoutUser);
router.route("/api/v1/refresh-Token").post(refreshAccessToken);

export default router;
