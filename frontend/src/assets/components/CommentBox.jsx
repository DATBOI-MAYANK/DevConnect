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
    state.posts.list.find((p) => p._id === postId),
  );
  const commentCount = post.comments?.length || 0;

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
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "transparent",
            border: "none",
            padding: 0,
            borderRadius: 0,
            maxWidth: "500px",
            width: "90%",
          },
        }}
        contentLabel="Comment Modal"
      >
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Add Comment</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors duration-200 text-xl font-bold w-8 h-8 flex items-center justify-center hover:bg-slate-700/50 rounded-full"
            >
              ×
            </button>
          </div>

          <div className="comment-box space-y-4">
            <textarea
              rows="4"
              className="w-full bg-slate-700/50 border border-slate-600/50 text-white p-4 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a thoughtful comment..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  submit();
                  setIsOpen(false);
                }}
                disabled={!text.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <button
        className="flex items-center space-x-1.5 hover:cursor-pointer  text-slate-400 hover:text-blue-400 transition-colors duration-200 group"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        {commentCount > 0 && <span className="text-white">{commentCount}</span>}
      </button>
    </>
  );
}

export default CommentBox;
