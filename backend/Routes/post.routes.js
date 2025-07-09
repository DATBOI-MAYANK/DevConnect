import { Router } from "express";
import {
  CreatePost,
  UpdatePost,
  DeletePost,
  GetPosts,
  toggleLike,
  addComment,
} from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/api/v1/create-post").post(
  verifyJwt,
  upload.fields([
    {
      name: "media",
      maxCount: 6,
    }
  ]),
  CreatePost
);

router.route("/api/v1/get-posts").get( GetPosts)

router.post("/api/v1/posts/:id/like", verifyJwt, toggleLike);
router.post("/api/v1/posts/:id/addComment", verifyJwt, addComment);

export default router;
