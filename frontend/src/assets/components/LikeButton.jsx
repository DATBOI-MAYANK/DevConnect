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
      className="mx-9 mt-2 flex hover:cursor-pointer gap-1 "
    >
      {likedByUser ? (
        <Heart fill="red" color="red" />
      ) : (
        <Heart className=" text-slate-400 hover:text-red-600 transition-colors duration-200" />
      )}{" "}
      {likesCount > 0 ? <>{likesCount}</> : null}
    </button>
  );
}

export default LikeButton;
