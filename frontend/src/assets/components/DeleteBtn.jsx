import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../features/PostSlice/postSlice.js";
import { useState } from "react";
import Modal from "react-modal";

function DeleteBtn({ postId }) {
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    try {
      setIsDeleting(true);
       dispatch(deletePost({ postId }));
      setIsDeleteModalOpen(false);
     
    } catch (error) {
      console.error("Delete post error:", error);
      alert(error?.response?.data?.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Trash2
        className="w-5 h-5 text-slate-500 hover:text-red-400 cursor-pointer transition-colors duration-200"
        onClick={()=> setIsDeleteModalOpen(true)}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => !isDeleting && setIsDeleteModalOpen(false)}
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
            maxWidth: "450px",
            width: "90%",
          },
        }}
        contentLabel="Delete Account Confirmation"
      >
        <div className="bg-gray-950 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-3">
            Delete your Post ?
          </h2>
          <p className="text-slate-300 mb-6">
            This action is permanent. 
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-slate-600/50 hover:cursor-pointer hover:bg-slate-600/70 text-white rounded-lg transition-all duration-200 disabled:opacity-60"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-red-600 hover:cursor-pointer hover:bg-red-700 text-white rounded-lg transition-all duration-200 disabled:opacity-60"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteBtn;
