import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "../../features/PostSlice/postSlice";

function LikeButton({ postId, userId }) {
  const dispatch = useDispatch();
  // Always get the latest post from Redux
  const post = useSelector((state) =>
    state.posts.list.find((p) => p._id === postId)
  );

  if (!post) return null;

  const likedByUser = post?.likes.some(
    (likeUser) => (likeUser._id || likeUser).toString() === userId.toString()
  );
  const likesCount = post?.likes.length || 0;

  const handleLike = () => {
    dispatch(toggleLike({ postId }));
  };

  return (
    <button onClick={handleLike}>
      {likedByUser ? "💖 Unlike" : "🤍 Like"} ({likesCount})
    </button>
  );
}

export default LikeButton;
