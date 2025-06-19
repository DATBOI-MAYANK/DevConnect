import { asyncHandler } from "../utils/asyncHandler.js";
import Post from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const CreatePost = asyncHandler(async (req, res) => {
  try {
    const { text, images, videos, githubRepo } = req.body;
    const post = await Post.create({
      author: req.user._id,
      text,
      images: images || [],
      videos: videos || [],
      githubRepo: githubRepo || "",
    });
    res.status(201).json(new ApiResponse(201, post, "Post Created"));
  } catch (err) {
    throw new ApiError(500, "Post generation unsuccesfull!!");
  }
});

const UpdatePost = asyncHandler(async (req, res) => {
  try {
    const { text, images, videos, githubRepo } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { text, images, videos, githubRepo },
      { new: true }
    );
    if (!post) {
      throw new ApiError(404, "Could not update the post!!");
    }
    res.status(200).json(new ApiResponse(200, post , "Post Successfully Updated."))
  } catch (error) {
    throw new ApiError(500, "Could not update the post!!")
  }
});

const DeletePost = asyncHandler(async(req, res)=>{
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if(!post){
            throw new ApiError(500, "Post not found!!")
        }
        res.status(200).json(new ApiResponse(200, post, "Post Deleted Successfully"))
    } catch (error) {
        
    }
})

export { CreatePost , UpdatePost , DeletePost};
