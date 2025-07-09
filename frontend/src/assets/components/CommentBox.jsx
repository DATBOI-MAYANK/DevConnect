import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../features/PostSlice/postSlice.js";
import { MessageCircle } from "lucide-react";
import Modal from "react-modal";
import { useSelector } from "react-redux";

function CommentBox({ postId }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const post = useSelector((state) =>
      state.posts.list.find((p) => p._id === postId)
    );
  

  const commentCount =  post.comments?.length || 0;
  

  const submit = () => {
    if (!text.trim()) return;
    dispatch(addComment({ postId, text }));
    setText("");
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#171717",
            color: "white",
          },
        }}
        contentLabel="Comment Modal"
      >
        <div className="comment-box mt-2">
          <textarea
            rows="2"
            className="w-full bg-gray-800 text-white p-2 rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment…"
          />
          <button
            onClick={() => {
              submit();
              setIsOpen(false);
            }}
            className="mt-1 px-3 py-1 bg-blue-600 rounded font-medium"
          >
            Comment
          </button>
        </div>
      </Modal>

      <button
        className="mt-2 hover:cursor-pointer flex gap-1"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <MessageCircle /> {commentCount > 0 ? commentCount : null}
      </button>
    </>
  );
}

export default CommentBox;
