import { Router } from "express";
import {
  CreatePost,
  UpdatePost,
  DeletePost,
} from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/api/v1/post").post(
  verifyJwt,
  upload.fields([
    {
      name: "images",
      maxCount: 4,
    },
    {
      name: "videos",
      maxCount: 2,
    },
  ]),
  CreatePost
);


export default router;