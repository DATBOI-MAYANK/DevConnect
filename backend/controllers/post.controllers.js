import { asyncHandler } from "../utils/asyncHandler.js";
import Post from "../models/post.model.js"
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";


const CreatePost = asyncHandler(async (req,res) =>{

    try {
        const {text, images , videos , githubRepo} = req.body;
        const post = await Post.create({
          author: req.user._id,
          text,
          images: images || [],
          videos: videos || [],
          githubRepo: githubRepo || "",  
        });
        res.status(201).json(new ApiResponse(201, post, "Post Created"))
    } catch (err) {
        throw new ApiError(500, "Post generation unsuccesfull!!")
    };

});




export {CreatePost}