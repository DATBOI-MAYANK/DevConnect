import { Router } from "express";
import {
  CreatePost , UpdatePost , DeletePost
} from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = router();