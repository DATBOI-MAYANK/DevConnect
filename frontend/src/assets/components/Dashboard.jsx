import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import ClickSpark from "../components/ClickSpark.jsx";
import LikeButton from "./LikeButton.jsx";
import { fetchPosts } from "../../features/PostSlice/postSlice";
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary.jsx";
import CommentList from "./CommentList.jsx";
import CommentBox from "./CommentBox.jsx";
import {
  Trash2,
  Copy,
  Eye,
  EyeOff,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

function Dashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.list);
  const [repoDetails, setRepoDetails] = useState([]);
  const [activeTab, setActiveTab] = useState("Post");
  const [showCommentsById, setShowCommentsById] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const userPosts = posts.filter((post) => post.author?._id === user?._id);

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

  const getGridClass = (totalImages) => {
    if (totalImages === 1) return "grid-cols-1";
    if (totalImages === 2) return "grid-cols-2";
    if (totalImages === 3) return "grid-cols-2";
    return "grid-cols-2";
  };

  useEffect(() => {
    const postRepoName = userPosts
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
  }, [user?.GithubUsername, posts, userPosts]);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ClickSpark>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 lg:ml-[300px]">
          <div className="grid grid-flow-row grid-cols-1 h-full">
            <Navbar />
            <div className="Dashboard ">
              <div className="relative">
                <Link
                  to="/"
                  className="absolute top-4 left-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/70 text-white hover:bg-slate-800/90 border border-slate-700/60 transition-colors"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                {user.CoverImage ? (
                  <img
                    src={user.CoverImage}
                    alt="CoverImage"
                    className="w-full h-[28vh] sm:h-[40vh] object-cover"
                  />
                ) : (
                  <div className="w-full h-[28vh] sm:h-[40vh] bg-gradient-to-r from-blue-900/50 to-slate-800/50 border-b border-slate-700/50"></div>
                )}

                {/* Avatar */}
                <div className="absolute bottom-0 left-4 sm:left-6 translate-y-1/2">
                  <img
                    src={user.AvatarImage}
                    alt="AvatarImage"
                    className="rounded-full w-24 h-24 sm:w-36 sm:h-36 object-cover border-4 border-slate-900"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="mt-16 sm:mt-20 px-4 sm:px-6 text-white">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {user.username}
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mt-2">
                  {user.Bio}
                </p>
              </div>

              {/* Tabs */}
              <div className="mt-8 px-4 sm:px-6 border-b border-slate-700/50">
                <div className="flex overflow-x-auto">
                  {["Post", "Media", "Github", "Soon"].map((tab) => (
                    <button
                      key={tab}
                      className={`text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg transition-all duration-300 border-b-2 hover:text-blue-400 ${
                        activeTab === tab
                          ? "text-blue-400 border-blue-400"
                          : "border-transparent hover:border-slate-600"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "Soon" ? "Coming Soon" : tab}
                    </button>
                  ))}
                </div>

                <div className="Data h-auto relative w-full py-6 mt-6 px-0">
                  {activeTab === "Post" ? (
                    userPosts.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-slate-400 text-xl">
                          No posts yet
                        </div>
                        <div className="text-slate-500 mt-2">
                          Share something with the world!
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {userPosts.map((post) => {
                          const repoInfo = repoDetails.find(
                            (r) => r.name === post.githubRepoName,
                          );
                          return (
                            <article
                              key={post._id}
                              className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={post.author?.AvatarImage}
                                    alt="Profile"
                                    className="h-12 w-12 rounded-full object-cover border-2 border-slate-600/50"
                                  />
                                  <strong className="text-white font-semibold">
                                    {post.author?.username || "Unknown"}
                                  </strong>
                                </div>
                                <Trash2 className="w-5 h-5 text-slate-500 hover:text-red-400 cursor-pointer transition-colors duration-200" />
                              </div>

                              <div className="text-slate-100 text-base sm:text-lg leading-relaxed mb-4 ml-0 sm:ml-14">
                                {post.text}
                              </div>

                              {post.images && post.images.length > 0 && (
                                <div
                                  className={`grid ${getGridClass(post.images.length)} gap-2 ml-0 sm:ml-14 mb-4 w-full sm:max-w-2xl`}
                                >
                                  {post.images.slice(0, 4).map((img, index) => (
                                    <div
                                      key={img}
                                      className={`relative cursor-pointer group overflow-hidden rounded-lg ${
                                        post.images.length === 3 && index === 0
                                          ? "row-span-2"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        openImageModal(post.images, index)
                                      }
                                    >
                                      <img
                                        src={img}
                                        alt={`post image ${index + 1}`}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                                      {post.images.length > 4 &&
                                        index === 3 && (
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
                                  className={`grid ${getGridClass(post.videos.length)} gap-2 ml-0 sm:ml-14 mb-4 w-full sm:max-w-2xl`}
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
                                <div className="bg-slate-800/60 border border-slate-600/50 rounded-xl p-5 mb-4 ml-0 sm:ml-14 w-full sm:max-w-2xl">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                                    <div className="flex items-center space-x-3 min-w-0">
                                      <img
                                        src={repoInfo.owner.avatar_url}
                                        alt={`${repoInfo.owner.login} avatar`}
                                        className="h-10 w-10 rounded-full object-cover border border-slate-600/50"
                                      />
                                      <strong className="text-white font-semibold text-lg truncate">
                                        {repoInfo.owner.login}
                                      </strong>
                                    </div>
                                    <button
                                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 transition-all duration-200 self-start sm:self-auto whitespace-nowrap"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          repoInfo.clone_url,
                                        );
                                        alert("Clone link Copied. !! ");
                                      }}
                                    >
                                      <Copy className="w-4 h-4" />
                                      <span className="text-sm font-medium">
                                        Clone
                                      </span>
                                    </button>
                                  </div>

                                  <a
                                    href={repoInfo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xl sm:text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-4 break-words"
                                  >
                                    <strong>{repoInfo.name}</strong>
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
                                      <label className="block text-blue-300 font-semibold mb-2">
                                        Language
                                      </label>
                                      <p className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                        {repoInfo.language || "Not specified"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-700/50">
                                <LikeButton
                                  postId={post._id}
                                  userId={user._id}
                                />
                                <CommentBox postId={post._id} />
                                <button
                                  className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                                  onClick={() => {
                                    setShowCommentsById((prev) => ({
                                      ...prev,
                                      [post._id]: !prev[post._id],
                                    }));
                                  }}
                                >
                                  {showCommentsById[post._id] ? (
                                    <>
                                      <EyeOff className="w-5 h-5" />
                                      <span className="font-medium">
                                        Hide Comments
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-5 h-5" />
                                      <span className="font-medium">
                                        Show Comments
                                      </span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div>
                                {showCommentsById[post._id] && (
                                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                                    <CommentList
                                      comments={post.comments || []}
                                    />
                                  </div>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )
                  ) : activeTab === "Media" ? (
                    userPosts.filter(
                      (post) =>
                        (post.images && post.images.length > 0) ||
                        (post.videos && post.videos.length > 0),
                    ).length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-slate-400 text-xl">
                          No media posts yet
                        </div>
                        <div className="text-slate-500 mt-2">
                          Share some photos or videos!
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {userPosts
                          .filter(
                            (post) =>
                              (post.images && post.images.length > 0) ||
                              (post.videos && post.videos.length > 0),
                          )
                          .map((post) => (
                            <article
                              key={post._id}
                              className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={post.author?.AvatarImage}
                                    alt="Profile"
                                    className="h-12 w-12 rounded-full object-cover border-2 border-slate-600/50"
                                  />
                                  <strong className="text-white font-semibold">
                                    {post.author?.username || "Unknown"}
                                  </strong>
                                </div>
                                <Trash2 className="w-5 h-5 text-slate-500 hover:text-red-400 cursor-pointer transition-colors duration-200" />
                              </div>

                              <div className="text-base sm:text-lg text-slate-100 leading-relaxed mb-4 ml-0 sm:ml-14">
                                {post.text}
                              </div>

                              {post.images && post.images.length > 0 && (
                                <div
                                  className={`grid ${getGridClass(post.images.length)} gap-2 ml-0 sm:ml-14 mb-4 w-full sm:max-w-2xl`}
                                >
                                  {post.images.slice(0, 4).map((img, index) => (
                                    <div
                                      key={img}
                                      className={`relative cursor-pointer group overflow-hidden rounded-lg ${
                                        post.images.length === 3 && index === 0
                                          ? "row-span-2"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        openImageModal(post.images, index)
                                      }
                                    >
                                      <img
                                        src={img}
                                        alt={`post image ${index + 1}`}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                                      {post.images.length > 4 &&
                                        index === 3 && (
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
                                  className={`grid ${getGridClass(post.videos.length)} gap-2 ml-0 sm:ml-14 mb-4 w-full sm:max-w-2xl`}
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

                              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-700/50">
                                <LikeButton
                                  postId={post._id}
                                  userId={user._id}
                                />
                                <CommentBox postId={post._id} />
                                <button
                                  className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                                  onClick={() => {
                                    setShowCommentsById((prev) => ({
                                      ...prev,
                                      [post._id]: !prev[post._id],
                                    }));
                                  }}
                                >
                                  {showCommentsById[post._id] ? (
                                    <>
                                      <EyeOff className="w-5 h-5" />
                                      <span className="font-medium">
                                        Hide Comments
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-5 h-5" />
                                      <span className="font-medium">
                                        Show Comments
                                      </span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <div>
                                {showCommentsById[post._id] && (
                                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                                    <CommentList
                                      comments={post.comments || []}
                                    />
                                  </div>
                                )}
                              </div>
                            </article>
                          ))}
                      </div>
                    )
                  ) : activeTab === "Github" ? (
                    userPosts.filter((post) => post.githubRepoName).length ===
                    0 ? (
                      <div className="text-center py-16">
                        <div className="text-slate-400 text-xl">
                          No repository posts yet
                        </div>
                        <div className="text-slate-500 mt-2">
                          Share your coding projects!
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {userPosts
                          .filter((post) => post.githubRepoName)
                          .map((post) => {
                            const repoInfo = repoDetails.find(
                              (r) => r.name === post.githubRepoName,
                            );

                            return (
                              <article
                                key={post._id}
                                className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={post.author?.AvatarImage}
                                      alt="Profile"
                                      className="h-12 w-12 rounded-full object-cover border-2 border-slate-600/50"
                                    />
                                    <strong className="text-white font-semibold">
                                      {post.author?.username || "Unknown"}
                                    </strong>
                                  </div>
                                  <Trash2 className="w-5 h-5 text-slate-500 hover:text-red-400 cursor-pointer transition-colors duration-200" />
                                </div>

                                <div className="text-base sm:text-lg text-slate-100 leading-relaxed mb-4 ml-0 sm:ml-14">
                                  {post.text}
                                </div>

                                {repoInfo && (
                                  <div className="bg-slate-800/60 border border-slate-600/50 rounded-xl p-5 mb-4 ml-0 sm:ml-14 w-full sm:max-w-2xl">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                                      <div className="flex items-center space-x-3 min-w-0">
                                        <img
                                          src={repoInfo.owner.avatar_url}
                                          alt={`${repoInfo.owner.login} avatar`}
                                          className="h-10 w-10 rounded-full object-cover border border-slate-600/50"
                                        />
                                        <strong className="text-white font-semibold text-lg truncate">
                                          {repoInfo.owner.login}
                                        </strong>
                                      </div>
                                      <button
                                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 transition-all duration-200 self-start sm:self-auto whitespace-nowrap"
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            repoInfo.clone_url,
                                          );
                                          alert("Clone link Copied. !! ");
                                        }}
                                      >
                                        <Copy className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                          Clone
                                        </span>
                                      </button>
                                    </div>

                                    <a
                                      href={repoInfo.html_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-xl sm:text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-4 break-words"
                                    >
                                      <strong>{repoInfo.name}</strong>
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

                                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-700/50">
                                  <LikeButton
                                    postId={post._id}
                                    userId={user._id}
                                  />
                                  <CommentBox postId={post._id} />
                                  <button
                                    className="flex items-center  space-x-2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                                    onClick={() => {
                                      setShowCommentsById((prev) => ({
                                        ...prev,
                                        [post._id]: !prev[post._id],
                                      }));
                                    }}
                                  >
                                    {showCommentsById[post._id] ? (
                                      <>
                                        <EyeOff className="w-5 h-5" />
                                        <span className="font-medium">
                                          Hide Comments
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-5 h-5" />
                                        <span className="font-medium">
                                          Show Comments
                                        </span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div>
                                  {showCommentsById[post._id] && (
                                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                                      <CommentList
                                        comments={post.comments || []}
                                      />
                                    </div>
                                  )}
                                </div>
                              </article>
                            );
                          })}
                      </div>
                    )
                  ) : activeTab === "Soon" ? (
                    <div className="text-center py-16">
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                        Coming Soon...
                      </div>
                      <div className="text-slate-400">
                        Exciting features are on the way!
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

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
      </ClickSpark>
    </ErrorBoundary>
  );
}

export default Dashboard;
