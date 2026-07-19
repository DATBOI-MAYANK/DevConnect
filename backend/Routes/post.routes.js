import { Router } from "express";
import {
  CreatePost,
  UpdatePost,
  GetPosts,
  toggleLike,
  addComment,
  deletePostById,
  getPostsByUserId,
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
    },
  ]),
  CreatePost,
);

router.route("/api/v1/get-posts").get(GetPosts);
router.route("/get-posts").get(GetPosts);

router.get("/api/v1/user/:userId", getPostsByUserId);
router.get("/user/:userId", getPostsByUserId);

router.post("/api/v1/posts/:id/like", verifyJwt, toggleLike);
router.post("/posts/:id/like", verifyJwt, toggleLike);

router.post("/api/v1/posts/:id/addComment", verifyJwt, addComment);
router.post("/posts/:id/addComment", verifyJwt, addComment);

router.delete("/api/v1/posts/:id/deletePost", verifyJwt, deletePostById);
router.delete("/posts/:id/deletePost", verifyJwt, deletePostById);

export default router;
