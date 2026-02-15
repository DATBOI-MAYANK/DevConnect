import { useEffect, useState } from "react";
import axios from "axios";
import ClickSpark from "./ClickSpark.jsx";
import LikeButton from "./LikeButton.jsx";
import CommentBox from "./CommentBox.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../features/PostSlice/postSlice.js";
import CommentList from "./CommentList.jsx";
import { Copy, X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteBtn from "./DeleteBtn.jsx";

function MainFeed() {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const posts = useSelector((state) => state.posts.list);
  const dispatch = useDispatch();
  const [repoDetails, setRepoDetails] = useState([]);
  const [showCommentsById, setShowCommentsById] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  const openImageModal = (images, index) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setSelectedImage(images[index]);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % currentImages.length
        : (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentImages[newIndex]);
  };

  useEffect(() => {
    const postRepoName = posts
      .filter((post) => post.githubRepoName)
      .map((post) => post.githubRepoName);
    if (!user.GithubUsername || postRepoName.length === 0) return;

    async function fetchSpecificRepos() {
      try {
        const promises = postRepoName.map((name) =>
          axios.get(
            `https://api.github.com/repos/${user.GithubUsername}/${name}`,
          ),
        );
        const results = await Promise.all(promises);
        const repoDetails = results.map((r) => r.data);
        setRepoDetails(repoDetails);
      } catch (err) {
        console.error("Error fetching repos:", err);
      }
    }

    fetchSpecificRepos();
  }, [user?.GithubUsername, posts]);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const getGridClass = (totalImages) => {
    if (totalImages === 1) return "grid-cols-1";
    if (totalImages === 2) return "grid-cols-2";
    if (totalImages === 3) return "grid-cols-2";
    return "grid-cols-2";
  };

  return (
    <ClickSpark>
      <div className="Data h-auto absolute w-full ">
        {posts.length == 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-400 text-xl">No posts found</div>
            <div className="text-slate-500 mt-2">
              Be the first to share something with the community!
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const repoInfo = repoDetails.find(
                (r) => r.name === post.githubRepoName,
              );
              return (
                <article
                  key={post._id}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl mb-0.5 border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.author?.AvatarImage}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover border-2 border-slate-600/50"
                      />
                      <Link
                        to={`/profile/${post.author?._id}`}
                        className="block text-white font-semibold hover:text-blue-400 transition-colors duration-200"
                      >
                        <strong>{post.author?.username || "Unknown"}</strong>
                      </Link>
                    </div>
                    {user?._id === post.author?._id && (
                      // <Trash2 className="w-5 h-5 text-slate-500 hover:text-red-400 cursor-pointer transition-colors duration-200" />
                      <DeleteBtn postId={post._id} />
                    )}
                  </div>

                  <div className="text-slate-100 text-lg leading-relaxed mb-4 ml-15">
                    {post.text}
                  </div>

                  {post.images && post.images.length > 0 && (
                    <div
                      className={`grid ${getGridClass(post.images.length)} gap-2 ml-15 mb-4 max-w-2xl`}
                    >
                      {post.images.map((img, index) => (
                        <div
                          key={img}
                          className={`relative cursor-pointer group overflow-hidden rounded-lg ${
                            post.images.length === 3 && index === 0
                              ? "row-span-2"
                              : ""
                          }`}
                          onClick={() => openImageModal(post.images, index)}
                        >
                          <img
                            src={img}
                            alt={`post image ${index + 1}`}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                          {post.images.length > 4 && index === 3 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-2xl font-bold">
                                +{post.images.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {post.videos && post.videos.length > 0 && (
                    <div
                      className={`grid ${getGridClass(post.videos.length)} gap-2 ml-15 mb-4 max-w-2xl`}
                    >
                      {post.videos.map((vid, index) => (
                        <video
                          key={vid}
                          src={vid}
                          controls
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {repoInfo && (
                    <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/40 rounded-xl p-5 w-full sm:max-w-2xl ml-0 sm:ml-14 mb-4 hover:bg-slate-700/40 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={repoInfo.owner.avatar_url}
                            alt={`${repoInfo.owner.login} avatar`}
                            className="h-10 w-10 rounded-full object-cover border-2 border-slate-600/50"
                          />
                          <strong className="text-white font-semibold text-lg truncate">
                            {repoInfo.owner.login}
                          </strong>
                        </div>
                        <button
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 transition-all duration-200 self-start sm:self-auto whitespace-nowrap"
                          onClick={() => {
                            navigator.clipboard.writeText(repoInfo.clone_url);
                            alert("Clone link copied!");
                          }}
                        >
                          <Copy className="w-4 h-4" />
                          <span className="text-sm font-medium">Clone</span>
                        </button>
                      </div>

                      <a
                        href={repoInfo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-white font-bold text-xl sm:text-2xl mb-4 hover:text-blue-400 transition-colors duration-200 break-words"
                      >
                        {repoInfo.name}
                      </a>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                          <label className="block text-blue-300 font-semibold mb-2">
                            Description
                          </label>
                          <p className="text-slate-200">
                            {repoInfo.description}
                          </p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                          <label className="text-slate-300 font-semibold text-sm uppercase tracking-wide mb-2 block">
                            Language
                          </label>
                          <p className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            {repoInfo.language || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 pt-4 border-t border-slate-700/50">
                    <LikeButton postId={post._id} userId={user._id} />
                    <CommentBox postId={post._id} />
                    <button
                      className="text-slate-400 hover:text-white font-medium transition-colors duration-200 flex items-center space-x-2"
                      onClick={() => {
                        setShowCommentsById((prev) => ({
                          ...prev,
                          [post._id]: !prev[post._id],
                        }));
                      }}
                    >
                      <span>
                        {showCommentsById[post._id] ? "Hide" : "Show"} Comments
                      </span>
                    </button>
                  </div>

                  {showCommentsById[post._id] && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <CommentList comments={post.comments || []} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeImageModal}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <img
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage("prev")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 bg-black/50 rounded-full p-2 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => navigateImage("next")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 bg-black/50 rounded-full p-2 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {currentImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ClickSpark>
  );
}

export default MainFeed;
