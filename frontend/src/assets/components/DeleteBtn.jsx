import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../features/PostSlice/postSlice.js";

function DeleteBtn({ postId }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost({ postId }));
    }
  };

  return (
    <Trash2
      className="w-5 h-5 text-slate-500 hover:text-red-400 cursor-pointer transition-colors duration-200"
      onClick={handleDelete}
    />
  );
}

export default DeleteBtn;
