import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import ClickSpark from "../components/ClickSpark.jsx";
import LikeButton from "./LikeButton.jsx";
import { fetchPosts } from "../../features/PostSlice/postSlice";
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary.jsx";
import CommentList from "./CommentList.jsx";
import CommentBox from "./CommentBox.jsx";
import { Trash2, Copy, Eye, EyeOff } from "lucide-react";

function Dashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.list);
  const [repoDetails, setRepoDetails] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [showCommentsById, setShowCommentsById] = useState(false);
  const userPosts = posts.filter((post) => post.author?._id === user?._id);

  useEffect(() => {
    const postRepoName = userPosts
      .filter((post) => post.githubRepoName)
      .map((post) => post.githubRepoName);
    if (!user.GithubUsername || postRepoName.length === 0) return;
    // console.log("RepoName", postRepoName);
    async function fetchSpecificRepos() {
      try {
        const promises = postRepoName.map((name) =>
          axios.get(
            `https://api.github.com/repos/${user.GithubUsername}/${name}`,
          ),
        );
        const results = await Promise.all(promises);
        const repoDetails = results.map((r) => r.data);
        // console.log("Result", results);
        // console.log("Promise", promises);
        // console.log("RepoDetails", repoDetails);
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
        <div className="h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 ml-[300px]">
          <div className="grid grid-flow-row grid-cols-1 h-full">
            <Navbar />
            <div className="Dashboard ">
              <div className="relative">
                {user.CoverImage ? (
                  <img
                    src={user.CoverImage}
                    alt="CoverImage"
                    className="w-full h-[40vh] object-cover"
                  />
                ) : (
                  <div className="w-full h-[40vh] bg-gradient-to-r from-blue-900/50 to-slate-800/50 border-b border-slate-700/50"></div>
                )}

                {/* Avatar */}
                <div className="absolute bottom-0 left-6 translate-y-1/2">
                  <img
                    src={user.AvatarImage}
                    alt="AvatarImage"
                    className="rounded-full w-36 h-36 object-cover border-4 border-slate-900"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="mt-20 px-6 text-white">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mt-2">
                  {user.Bio}
                </p>
              </div>

              {/* Tabs */}

              <div className="mt-8 px-6 border-b border-slate-700/50">
                <div className="flex overflow-x-auto">
                  {["Post", "Media", "Github", "Soon"].map((tab) => (
                    <button
                      key={tab}
                      className={`text-white font-semibold px-6 py-4 text-lg transition-all duration-300 border-b-2 hover:text-blue-400 ${
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

                <div className="Data h-auto absolute top-[80vh] w-[140vh] py-6 mb-2 mt-10 px-0">
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

                              <div className="text-slate-100 text-lg leading-relaxed mb-4 ml-15">
                                {post.text}
                              </div>

                              {post.images && post.images.length > 0 && (
                                <div
                                  className="grid gap-3 mb-4 ml-15"
                                  style={{
                                    gridTemplateColumns:
                                      post.images.length === 1
                                        ? "1fr"
                                        : "repeat(auto-fit, minmax(300px, 1fr))",
                                  }}
                                >
                                  {post.images.map((img) => (
                                    <img
                                      src={img}
                                      key={img}
                                      alt="post"
                                      className="rounded-xl object-cover max-h-96 w-full border border-slate-700/30"
                                      onLoad={(e) => {
                                        const el = e.target;
                                        el.classList.remove(
                                          "landscape",
                                          "portrait",
                                        );
                                        el.classList.add(
                                          el.naturalWidth > el.naturalHeight
                                            ? "landscape"
                                            : "portrait",
                                        );
                                      }}
                                    />
                                  ))}
                                </div>
                              )}

                              {post.videos && post.videos.length > 0 && (
                                <div
                                  className="grid gap-3 mb-4 ml-15"
                                  style={{
                                    gridTemplateColumns:
                                      post.videos.length === 1
                                        ? "1fr"
                                        : "repeat(auto-fit, minmax(300px, 1fr))",
                                  }}
                                >
                                  {post.videos.map((vid) => (
                                    <video
                                      src={vid}
                                      key={vid}
                                      controls
                                      className="rounded-xl max-h-96 w-full border border-slate-700/30"
                                      onLoadedMetadata={(e) => {
                                        const el = e.target;
                                        el.classList.add(
                                          el.videoWidth > el.videoHeight
                                            ? "landscape"
                                            : "portrait",
                                        );
                                      }}
                                    />
                                  ))}
                                </div>
                              )}

                              {repoInfo && (
                                <div className="bg-slate-800/60 border border-slate-600/50 rounded-xl p-5 mb-4 ml-15">
                                  <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={repoInfo.owner.avatar_url}
                                        alt={`${repoInfo.owner.login} avatar`}
                                        className="h-10 w-10 rounded-full object-cover border border-slate-600/50"
                                      />
                                      <strong className="text-white font-semibold text-lg">
                                        {repoInfo.owner.login}
                                      </strong>
                                    </div>
                                    <button
                                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 transition-all duration-200"
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
                                    className="block text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-4"
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
                                      <p className="text-slate-200">
                                        {repoInfo.language}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center space-x-6 pt-4 border-t border-slate-700/50">
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
                    userPosts.length === 0 ? (
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
                              <div className="flex mb-2">
                                <img
                                  src={post.author?.AvatarImage}
                                  alt="Profile"
                                  className="h-12 w-12 rounded-full mr-3 object-cover border-2 border-slate-600/50"
                                />
                                <strong className="text-white font-semibold">
                                  {post.author?.username || "Unknown"}
                                </strong>
                              </div>
                              <div className="text-lg text-slate-100 leading-relaxed mb-4 ml-15">
                                {post.text}
                              </div>
                              {post.images && post.images.length > 0 && (
                                <div
                                  className="grid gap-3 mb-4 ml-15"
                                  style={{
                                    gridTemplateColumns:
                                      post.images.length === 1
                                        ? "1fr"
                                        : "repeat(auto-fit, minmax(300px, 1fr))",
                                  }}
                                >
                                  {post.images.map((img) => (
                                    <img
                                      src={img}
                                      key={img}
                                      alt="post"
                                      className="rounded-xl object-cover max-h-96 w-full border border-slate-700/30"
                                      onLoad={(e) => {
                                        const el = e.target;
                                        el.classList.remove(
                                          "landscape",
                                          "portrait",
                                        );
                                        el.classList.add(
                                          el.naturalWidth > el.naturalHeight
                                            ? "landscape"
                                            : "portrait",
                                        );
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                              {post.videos && post.videos.length > 0 && (
                                <div
                                  className="grid gap-3 mb-4 ml-15"
                                  style={{
                                    gridTemplateColumns:
                                      post.videos.length === 1
                                        ? "1fr"
                                        : "repeat(auto-fit, minmax(300px, 1fr))",
                                  }}
                                >
                                  {post.videos.map((vid) => (
                                    <video
                                      src={vid}
                                      key={vid}
                                      controls
                                      className="rounded-xl max-h-96 w-full border border-slate-700/30"
                                      onLoadedMetadata={(e) => {
                                        const el = e.target;
                                        el.classList.add(
                                          el.videoWidth > el.videoHeight
                                            ? "landscape"
                                            : "portrait",
                                        );
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center space-x-6 pt-4 border-t border-slate-700/50">
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
                    userPosts.length === 0 ? (
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
                                <div className="flex mb-2">
                                  <img
                                    src={post.author?.AvatarImage}
                                    alt="Profile"
                                    className="h-12 w-12 rounded-full mr-3 object-cover border-2 border-slate-600/50"
                                  />
                                  <strong className="text-white font-semibold">
                                    {post.author?.username || "Unknown"}
                                  </strong>
                                </div>
                                <div className="text-lg text-slate-100 leading-relaxed mb-4 ml-15">
                                  {post.text}
                                </div>
                                {repoInfo && (
                                  <div className="bg-slate-800/60 border border-slate-600/50 rounded-xl p-5 mb-4 ml-15">
                                    <div className="flex justify-between">
                                      <div className="flex mb-2 w-70">
                                        <img
                                          src={repoInfo.owner.avatar_url}
                                          alt={`${repoInfo.owner.login} avatar`}
                                          className="h-10 w-10 rounded-full mr-2 object-cover border border-slate-600/50"
                                        />
                                        <strong className="mt-2 font-bold text-xl text-white">
                                          {repoInfo.owner.login}
                                        </strong>
                                      </div>
                                      <div className="flex mb-2">
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className=""
                                        >
                                          <button
                                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 transition-all duration-200"
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
                                        </a>
                                      </div>
                                    </div>
                                    <a
                                      href={repoInfo.html_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block ml-11 font-bold text-2xl my-5 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                    >
                                      <strong>{repoInfo.name}</strong>
                                    </a>
                                    <div className="">
                                      <div className="my-2 bg-slate-700/30 rounded-lg border border-slate-600/30 max-w-2/5 ml-11 p-4">
                                        <label className="block text-blue-300 font-semibold mb-2">
                                          Description
                                        </label>
                                        <p className="text-slate-200">
                                          {repoInfo.description}
                                        </p>
                                      </div>
                                      <div className="my-2 bg-slate-700/30 rounded-lg border border-slate-600/30 w-50 ml-11 p-4">
                                        <label className="block text-blue-300 font-semibold mb-2">
                                          Language
                                        </label>
                                        <p className="text-slate-200">
                                          {repoInfo.language}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center space-x-6 pt-4 border-t border-slate-700/50">
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
      </ClickSpark>
    </ErrorBoundary>
  );
}

export default Dashboard;
