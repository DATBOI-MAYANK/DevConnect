import { asyncHandler } from "../utils/asyncHandler.js";
import Post from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const CreatePost = asyncHandler(async (req, res) => {
  try {
    const { text, githubRepoName } = req.body;
    const media = req.files && req.files.media;
    let imageUrls = [];
    let videoUrls = [];

    if (media) {
      const items = Array.isArray(media) ? media : [media];
      if (items.length > 0) {
        for (const medias of items) {
          if (!medias.mimetype || !medias.path) continue;
          const isVideo = medias.mimetype.startsWith("video/");
          const url = await uploadOnCloudinary(medias.path);
          if (isVideo) {
            videoUrls.push(url);
          } else {
            imageUrls.push(url);
          }
        }
      }
    }

    const post = await Post.create({
      author: req.user._id,
      text,
      images: imageUrls,
      videos: videoUrls,
      githubRepoName: githubRepoName || "",
    });

    res.status(201).json(new ApiResponse(201, post, "Post Created"));
  } catch (err) {
    throw new ApiError(500, "Something went wrong while creating post.");
  }
});

const GetPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username AvatarImage")
      .populate("comments.user", "username AvatarImage")
      .sort({ createdAt: -1 });
    res.json(new ApiResponse(200, posts));
  } catch (error) {
    throw new ApiError(500, "Could not find/fetch  Posts");
  }
});

const UpdatePost = asyncHandler(async (req, res) => {
  try {
    const { text, githubRepoName } = req.body;
    const media = req.files.media || {};
    let imageUrls = [];
    let videoUrls = [];

    // Upload new images to Cloudinary
    if (media.images) {
      const images = Array.isArray(media.images)
        ? media.images
        : [media.images];
      for (const medias of images) {
        const url = await uploadOnCloudinary(medias.path, "image");
        imageUrls.push(url);
      }
    }

    // Upload new videos to Cloudinary
    if (media.videos) {
      const videos = Array.isArray(media.videos)
        ? media.videos
        : [media.videos];
      for (const medias of videos) {
        const url = await uploadOnCloudinary(medias.path, "video");
        videoUrls.push(url);
      }
    }

    // Update the post (replace old media with new if provided)
    const updateFields = {
      text,
      githubRepoName,
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

const getPostsByUserId = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .populate("author", "username AvatarImage")
      .populate("comments.user", "username AvatarImage")
      .sort({ createdAt: -1 });

    return res.json(
      new ApiResponse(200, posts, "User posts fetched successfully"),
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching user posts");
  }
});

const deletePostById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (post.author.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only delete your own posts");
    }

    await Post.findByIdAndDelete(id);

    return res.json(
      new ApiResponse(200, { deletedPostId: id }, "Post deleted successfully"),
    );
  } catch (error) {
    throw new ApiError(500, "Error deleting post");
  }
});

const toggleLike = asyncHandler(async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    const liked = post.likes.includes(userId);

    if (liked) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    // Optionally, populate author for frontend
    const updatedPost = await Post.findById(postId)
      .populate("author", "username AvatarImage")
      .populate("likes", "username");

    return res
      .status(200)
      .json(new ApiResponse(200, { updatedPost }, liked ? "Unliked" : "Liked"));
  } catch (error) {
    next(error);
  }
});

const addComment = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const { username, AvatarImage } = req.user;
    if (!text || !text.trim()) {
      throw new ApiError(400, "Comments cannot be empty.!!");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            user: req.user._id,
            text,
            username,
            AvatarImage,
            createdAt: Date.now(),
          },
        },
      },
      { new: true },
    )
      .populate("author", "username AvatarImage")
      .populate("comments.user", "username AvatarImage");
    if (!updatedPost) throw new ApiError(404, "Post not Found");
    res
      .status(200)
      .json(new ApiResponse(200, { updatedPost }, "Comment added"));
  } catch (error) {
    next(error);
  }
});

export {
  CreatePost,
  UpdatePost,
  deletePostById,
  GetPosts,
  toggleLike,
  addComment,
  getPostsByUserId,
};
