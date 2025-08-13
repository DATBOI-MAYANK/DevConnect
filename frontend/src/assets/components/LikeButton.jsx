import React from "react";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "../../features/PostSlice/postSlice.js";

function LikeButton({ postId, userId }) {
  const dispatch = useDispatch();
  // Always get the latest post from Redux
  const post = useSelector((state) =>
    state.posts.list.find((p) => p._id === postId),
  );

  if (!post) return null;

  const likedByUser = post?.likes.some(
    (likeUser) => (likeUser._id || likeUser).toString() === userId.toString(),
  );
  const likesCount = post?.likes.length || 0;

  const handleLike = () => {
    dispatch(toggleLike({ postId }));
  };
  return (
    <button
      onClick={handleLike}
      className="mx-9    flex hover:cursor-pointer space-x-1.5 "
    >
      {likedByUser ? (
        <Heart fill="red" color="red" />
      ) : (
        <Heart className="  text-slate-400 w-5 h-5 hover:scale-110 hover:text-red-600 transition-colors duration-200" />
      )}{" "}
      {likesCount > 0 ? <span className="text-white">{likesCount}</span> : null}
    </button>
  );
}

export default LikeButton;
