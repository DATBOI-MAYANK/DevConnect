import { Router } from "express";
import {
  CreatePost,
  UpdatePost,
  DeletePost,
  GetPosts,
  toggleLike,
} from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/api/v1/create-post").post(
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

router.route("/api/v1/get-posts").get( GetPosts)

router.post("/api/v1/posts/:id/like", verifyJwt, toggleLike);

// // POST /users/api/v1/post/:id/comment
// router.post("/api/v1/post/:id/comment", verifyJwt,CommentPost );

export default router;
