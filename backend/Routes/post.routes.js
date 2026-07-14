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

router.route("/create-post").post(
  verifyJwt,
  upload.fields([
    {
      name: "media",
      maxCount: 6,
    },
  ]),
  CreatePost,
);

router.route("/get-posts").get(GetPosts);
router.get("/:userId", getPostsByUserId);
router.post("/posts/:id/like", verifyJwt, toggleLike);
router.post("/posts/:id/addComment", verifyJwt, addComment);
router.delete("/posts/:id/deletePost", verifyJwt, deletePostById);

export default router;
