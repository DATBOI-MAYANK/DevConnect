import  { useState } from "react";
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
      files.forEach((file) => formData.append("media", file));
      await axios.post(
        "http://localhost:8000/users/api/v1/create-post",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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
      contentLabel="Create Post Modal"
    >
      <h2 className="text-2xl mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-24 p-2 mb-4 rounded text-white bg-gray-800"
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="block mb-2">Upload Images/Videos </label>
        <input
          type="file"
          name="media"
          accept="image/*, video/*"
          multiple
          onChange={handleFilesChange}
          className="mb-4 text-white bg-gray-800 rounded p-2  "
        />

        <label className="block mb-2">GitHub Repository </label>
        <input
          type="text"
          placeholder={`Please Enter the repository name `}
          value={githubRepoName}
          onChange={(e) => setGithubRepoName(e.target.value)}
          className="w-full p-2 mb-4 rounded text-white bg-gray-800"
        />

        <div className="flex gap-2">
          <button
            type="button"
            className=" text-black px-4 py-2 border-1 rounded-md shadow-[4px_4px_0px_0px_white] hover:cursor-pointer bg-red-700 hover:bg-red-600"
            onClick={onRequestClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className=" text-black px-4 py-2 border-1 rounded-md shadow-[4px_4px_0px_0px_white] hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
