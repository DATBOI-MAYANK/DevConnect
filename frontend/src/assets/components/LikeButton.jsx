import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Like } from "../../features/PostSlice/postSlice.js";

function LikeButton({ postId }) {
  const dispatch = useDispatch();
  // Always get the latest post from Redux
  const post = useSelector((state) => {
   return   state.posts.list.find((p) => p._id === postId);
  });


  const handleLike = () => {
    dispatch(Like({ postId }));
  };

  const isLiked = post.isLiked || 0;
  const likeCount = post.likeCount;

  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });

  return (
    <button
      onClick={handleLike}
      className="mx-9    flex items-center hover:cursor-pointer space-x-1.5 "
    >
      {isLiked ? (
        <Heart fill="red" color="red" className=" w-5 h-5" />
      ) : (
        <Heart className="  text-slate-400 w-5 h-5 hover:scale-110 hover:text-red-600 transition-colors duration-200" />
      )}{" "}
      {likeCount > 0 ? (
        <span className="text-white">{formatter.format(likeCount)}</span>
      ) : null}
    </button>
  );
}

export default LikeButton;
