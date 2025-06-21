import { asyncHandler } from "../utils/asyncHandler.js";
import Post from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const CreatePost = asyncHandler(async (req, res) => {
  try {
    const { text, githubRepo } = req.body;
    const files = req.files || {};
    let imageUrls = [];
    let videoUrls = [];

    // Upload images to Cloudinary
    if (files.images) {
      const images = Array.isArray(files.images)
        ? files.images
        : [files.images];
      for (const file of images) {
        const url = await uploadOnCloudinary(file.path, "image");
        imageUrls.push(url);
      }
    }

    // Upload videos to Cloudinary
    if (files.videos) {
      const videos = Array.isArray(files.videos)
        ? files.videos
        : [files.videos];
      for (const file of videos) {
        const url = await uploadOnCloudinary(file.path, "video");
        videoUrls.push(url);
      }
    }

    const post = await Post.create({
      author: req.user._id,
      text,
      images: imageUrls,
      videos: videoUrls,
      githubRepo: githubRepo || "",
    });

    res.status(201).json(new ApiResponse(201, post, "Post Created"));
  } catch (err) {
    throw new ApiError(500, "Something went wrong while creating post.");
  }
});

const UpdatePost = asyncHandler(async (req, res) => {
  try {
    const { text, githubRepo } = req.body;
    const files = req.files || {};
    let imageUrls = [];
    let videoUrls = [];

    // Upload new images to Cloudinary
    if (files.images) {
      const images = Array.isArray(files.images)
        ? files.images
        : [files.images];
      for (const file of images) {
        const url = await uploadOnCloudinary(file.path, "image");
        imageUrls.push(url);
      }
    }

    // Upload new videos to Cloudinary
    if (files.videos) {
      const videos = Array.isArray(files.videos)
        ? files.videos
        : [files.videos];
      for (const file of videos) {
        const url = await uploadOnCloudinary(file.path, "video");
        videoUrls.push(url);
      }
    }

    // Update the post (replace old media with new if provided)
    const updateFields = {
      text,
      githubRepo,
    };
    if (imageUrls.length > 0) updateFields.images = imageUrls;
    if (videoUrls.length > 0) updateFields.videos = videoUrls;

    const userId = req.user._id;
    const post = await Post.findOneAndUpdate({ author: userId }, updateFields, {
      new: true,
    });

    if (!post) throw new ApiError(404, "Post not found");
    res.json(new ApiResponse(200, post, "Post Updated Successfully."));
  } catch (err) {
    throw new ApiError(500, "Something went wrong while updating Post. ");
  }
});

const DeletePost = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await Post.findOneAndDelete({ author: userId });
    if (!post) {
      throw new ApiError(500, "Post not found!!");
    }
    res
      .status(200)
      .json(new ApiResponse(200, post, "Post Deleted Successfully"));
  } catch (err) {
    throw new ApiError(500, "Something went wrong while deleting Post. ");
  }
});

export { CreatePost, UpdatePost, DeletePost };
