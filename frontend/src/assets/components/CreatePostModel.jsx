import { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

export default function CreatePostModal({ isOpen, onRequestClose }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [githubRepoName, setGithubRepoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  const handleFilesChange = (e) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("githubRepoName", githubRepoName);
      if (files.length > 4) {
        return alert("You can't upload more than 4 files. ");
      } else {
        files.forEach((file) => formData.append("media", file));
        await axios.post(
          "http://localhost:8000/users/api/v1/create-post",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }
      setText("");
      setFiles([]);
      setGithubRepoName("");
      onRequestClose();
    } catch (err) {
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
      contentLabel="Create Post Modal"
    >
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create a Post</h2>
          <button
            onClick={onRequestClose}
            className="text-slate-400 hover:text-white transition-colors duration-200 text-xl font-bold w-8 h-8 flex items-center justify-center hover:bg-slate-700/50 rounded-full"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              className="w-full h-32 p-4 rounded-xl text-white bg-slate-700/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
              placeholder="What's happening?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
              Upload Images/Videos
            </label>
            <div className="relative">
              <input
                type="file"
                name="media"
                accept="image/*, video/*"
                multiple
                onChange={handleFilesChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="bg-slate-700/50 border border-slate-600/50 border-dashed rounded-xl p-6 text-center hover:bg-slate-700/70 hover:border-slate-500/50 transition-all duration-200">
                <div className="text-slate-400 mb-2">
                  <svg
                    className="mx-auto h-8 w-8 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">
                  Click to upload or drag and drop
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Images and videos (max 4 files)
                </p>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
              GitHub Repository
            </label>
            <input
              type="text"
              placeholder="Enter repository name (optional)"
              value={githubRepoName}
              onChange={(e) => setGithubRepoName(e.target.value)}
              className="w-full p-4 rounded-xl text-white bg-slate-700/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 px-6 py-3 bg-slate-600/50 hover:bg-slate-600/70 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              onClick={onRequestClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Posting...
                </div>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
