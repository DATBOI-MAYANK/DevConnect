import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../features/PostSlice/postSlice.js";
import {MessageCircle} from "lucide-react"

export default function CommentBox({ postId }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    dispatch(addComment({ postId, text }));
    setText("");
  };

  return (
    // <div className="comment-box mt-2">
    //   <textarea
    //     rows="2"
    //     className="w-full bg-gray-800 text-white p-2 rounded"
    //     value={text}
    //     onChange={(e) => setText(e.target.value)}
    //     placeholder="Write a comment…"
    //   />
    //   <button
    //     onClick={submit}
    //     className="mt-1 px-3 py-1 bg-blue-600 rounded font-medium"
    //   >
    //     Comment
    //   </button>
    // </div>
    <button className="mt-2 " >
      <MessageCircle />
    </button>
  );
}
