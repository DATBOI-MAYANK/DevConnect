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
            `https://api.github.com/repos/${user.GithubUsername}/${name}`
          )
        );
        const results = await Promise.all(promises);
        const repoDetails = results.map((r) => r.data);
        // console.log("Result", results);
        // console.log("Promise", promises);
        console.log("RepoDetails", repoDetails);
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

  return (
    <ErrorBoundary>
      <ClickSpark>
        <div className="h-screen w-auto ml-[300px]">
          <div className="grid grid-flow-row grid-cols-1 h-full ">
            <Navbar />
            <div className="Dashboard relative bg-black  ">
              {user.CoverImage ? (
                <img
                  src={user.CoverImage}
                  alt="CoverImage"
                  className="w-full h-1/4 object-cover "
                ></img>
              ) : (
                <div className="Cover_Image w-full h-1/4 bg-black border-b-2 border-[#2F3336]"></div>
              )}

              <div className=" absolute Avatar_Image flex justify-center items-center w-35 h-35 top-1/6 left-2 bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700 rounded-full  ">
                <img
                  src={user.AvatarImage}
                  alt="AvatarImage"
                  className="rounded-full w-33 h-33 object-cover "
                />
              </div>
              <div className="Info absolute top-2/5 flex flex-col  text-white ">
                <span className="ml-5 text-2xl font-bold">{user.username}</span>
                <span className="m-5 text-xl font-light">{user.Bio}</span>
              </div>
              <div className="Buttons absolute top-7/12 ">
                <button
                  className="text-white font-bold  px-20 py-2 border-1 text-2xl hover:cursor-pointer"
                  onClick={() => setActiveTab("Post")}
                >
                  Post
                </button>
                <button
                  className="text-white font-bold   px-20 py-2 border-1 text-2xl hover:cursor-pointer"
                  onClick={() => setActiveTab("Media")}
                >
                  Media
                </button>
                <button
                  className="text-white font-bold   px-16 py-2 border-1 text-2xl hover:cursor-pointer"
                  onClick={() => setActiveTab("Github")}
                >
                  Github Repo
                </button>
                <button
                  className="text-white font-bold   px-16 py-2 border-1 text-2xl hover:cursor-pointer"
                  onClick={() => setActiveTab("Soon")}
                >
                  Coming Soon...
                </button>
              </div>
              <div className="Data h-auto absolute top-4/6 w-full py-2 mb-2 rounded">
                {activeTab === "Post" ? (
                  userPosts.length === 0 ? (
                    <div className="text-white">No Posts Found</div>
                  ) : (
                    userPosts.map((post) => {
                      const repoInfo = repoDetails.find(
                        (r) => r.name === post.githubRepoName
                      );
                      return (
                        <div
                          key={post._id}
                          className="mb-4 p-3 bg-black text-white border-b-1 border-[#2F3336]"
                        >
                          <div className="flex mb-2">
                            <img
                              src={post.author?.AvatarImage}
                              alt="Profile"
                              className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
                            />
                            <strong>
                              {post.author?.username || "Unknown"}
                            </strong>
                          </div>
                          <div className="text-xl ml-10">{post.text}</div>

                          {post.images && post.images.length > 0 && (
                            <div className="grid-container ml-10 ">
                              {post.images.map((img) => (
                                <img
                                  src={img}
                                  key={img}
                                  alt="post"
                                  className=" media-img "
                                  onLoad={(e) => {
                                    const el = e.target;
                                    el.classList.remove(
                                      "landscape",
                                      "portrait"
                                    );
                                    el.classList.add(
                                      el.naturalWidth > el.naturalHeight
                                        ? "landscape"
                                        : "portrait"
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          )}
                          {post.videos && post.videos.length > 0 && (
                            <div className="flex gap-2 mt-2 ml-10">
                              {post.videos.map((vid) => (
                                <video
                                  src={vid}
                                  key={vid}
                                  controls
                                  className="media-video"
                                  onLoadedMetadata={(e) => {
                                    const el = e.target;
                                    el.classList.add(
                                      el.videoWidth > el.videoHeight
                                        ? "landscape"
                                        : "portrait"
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          )}
                          {repoInfo && (
                            <div className="repo-card w-auto border  border-[#2F3336] p-2 rounded-lg max-w-fit ml-10 m-5">
                              <div className="flex justify-between">
                                <div className="flex mb-2 w-70">
                                  <img
                                    src={repoInfo.owner.avatar_url}
                                    alt={`${repoInfo.owner.login} avatar`}
                                    className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
                                  />
                                  <strong className="mt-2 font-bold text-xl">
                                    {repoInfo.owner.login}
                                  </strong>
                                </div>
                                <div className="flex mb-2 ">
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="  "
                                  >
                                    <button
                                      className="p-2 hover:cursor-pointer "
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          repoInfo.clone_url
                                        ),
                                          alert("Clone link Copied. !! ");
                                      }}
                                    >
                                      Copy
                                    </button>
                                  </a>
                                </div>
                              </div>
                              <a
                                href={repoInfo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block ml-11 font-bold text-3xl my-5  "
                              >
                                <strong>{repoInfo.name}</strong>
                              </a>
                              <div className="">
                                <div className="my-2 border-1 border-[#2F3336] max-w-2/5 ml-11 p-2 rounded-lg">
                                  <label className=" font-bold text-lg ">
                                    Description
                                  </label>
                                  <p className="pt-2">{repoInfo.description}</p>
                                </div>
                                <div className="my-2 border-1 border-[#2F3336] w-50 ml-11 p-2 rounded-lg">
                                  <label className="block font-bold text-lg  my-1 ">
                                    Language
                                  </label>
                                  <p>{repoInfo.language}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex ml-3">
                            <LikeButton postId={post._id} userId={user._id} />
                            <CommentBox postId={post._id} />

                            <button
                              className="ml-10 font-bold mt-2 hover:cursor-pointer"
                              onClick={() => {
                                setShowCommentsById((prev) => ({
                                  ...prev,
                                  [post._id]: !prev[post._id],
                                }));
                              }}
                            >
                              {showCommentsById[post._id] ? "Hide" : "Show"}{" "}
                              Comments
                            </button>
                          </div>
                          <div>
                            {showCommentsById[post._id] && (
                              <CommentList comments={post.comments || []} />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )
                ) : activeTab === "Media" ? (
                  userPosts.length === 0 ? (
                    <div className="text-white text-4xl">No Posts Found</div>
                  ) : (
                    <div className="">
                      {userPosts
                        .filter(
                          (post) =>
                            (post.images && post.images.length > 0) ||
                            (post.videos && post.videos.length > 0)
                        )
                        .map((post) => (
                          <div
                            key={post._id}
                            className="mb-4 p-3 bg-black text-white border-b-1 border-[#2F3336]"
                          >
                            <div className="flex mb-2">
                              <img
                                src={post.author?.AvatarImage}
                                alt="Profile"
                                className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
                              />
                              <strong className="text-white">
                                {post.author?.username || "Unknown"}
                              </strong>
                            </div>
                            <div className="text-xl text-white ml-10">
                              {post.text}
                            </div>
                            {post.images && post.images.length > 0 && (
                              <div className="grid-container ml-10  mt-2">
                                {post.images.map((img) => (
                                  <img
                                    src={img}
                                    key={img}
                                    alt="post"
                                    className="media-img"
                                    onLoad={(e) => {
                                      const el = e.target;
                                      el.classList.remove(
                                        "landscape",
                                        "portrait"
                                      );
                                      el.classList.add(
                                        el.naturalWidth > el.naturalHeight
                                          ? "landscape"
                                          : "portrait"
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            {post.videos && post.videos.length > 0 && (
                              <div className="grid-container ml-10 mt-2">
                                {post.videos.map((vid) => (
                                  <video
                                    src={vid}
                                    key={vid}
                                    controls
                                    className="media-video"
                                    onLoadedMetadata={(e) => {
                                      const el = e.target;
                                      el.classList.add(
                                        el.videoWidth > el.videoHeight
                                          ? "landscape"
                                          : "portrait"
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            <div className="flex ml-3">
                              <LikeButton postId={post._id} userId={user._id} />
                              <CommentBox postId={post._id} />

                              <button
                                className="ml-10 font-bold mt-2 hover:cursor-pointer"
                                onClick={() => {
                                  setShowCommentsById((prev) => ({
                                    ...prev,
                                    [post._id]: !prev[post._id],
                                  }));
                                }}
                              >
                                {showCommentsById[post._id] ? "Hide" : "Show"}{" "}
                                Comments
                              </button>
                            </div>
                            <div>
                              {showCommentsById[post._id] && (
                                <CommentList comments={post.comments || []} />
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )
                ) : activeTab === "Github" ? (
                  userPosts.length === 0 ? (
                    <div className="text-white">No Posts Found</div>
                  ) : (
                    <div>
                      {userPosts
                        .filter((post) => post.githubRepoName)
                        .map((post) => {
                          const repoInfo = repoDetails.find(
                            (r) => r.name === post.githubRepoName
                          );

                          return (
                            <div
                              key={post._id}
                              className="p-3 text-white border-b-1 border-[#2F3336]"
                            >
                              <div className="flex mb-2">
                                <img
                                  src={post.author?.AvatarImage}
                                  alt="Profile"
                                  className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
                                />
                                <strong>
                                  {post.author?.username || "Unknown"}
                                </strong>
                              </div>
                              <div className="text-xl text-white ml-10">
                                {post.text}
                              </div>
                              {repoInfo && (
                                <div className="repo-card w-auto border  border-[#2F3336] p-2 rounded-lg max-w-fit ml-10 m-5">
                                  <div className="flex justify-between">
                                    <div className="flex mb-2 w-70">
                                      <img
                                        src={repoInfo.owner.avatar_url}
                                        alt={`${repoInfo.owner.login} avatar`}
                                        className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
                                      />
                                      <strong className="mt-2 font-bold text-xl">
                                        {repoInfo.owner.login}
                                      </strong>
                                    </div>
                                    <div className="flex mb-2 ">
                                      <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="  "
                                      >
                                        <button
                                          className="p-2 hover:cursor-pointer "
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              repoInfo.clone_url
                                            ),
                                              alert("Clone link Copied. !! ");
                                          }}
                                        >
                                          Copy
                                        </button>
                                      </a>
                                    </div>
                                  </div>
                                  <a
                                    href={repoInfo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block ml-11 font-bold text-3xl my-5  "
                                  >
                                    <strong>{repoInfo.name}</strong>
                                  </a>
                                  <div className="">
                                    <div className="my-2 border-1 border-[#2F3336] max-w-2/5 ml-11 p-2 rounded-lg">
                                      <label className=" font-bold text-lg ">
                                        Description
                                      </label>
                                      <p className="pt-2">
                                        {repoInfo.description}
                                      </p>
                                    </div>
                                    <div className="my-2 border-1 border-[#2F3336] w-50 ml-11 p-2 rounded-lg">
                                      <label className="block font-bold text-lg  my-1 ">
                                        Language
                                      </label>
                                      <p>{repoInfo.language}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="flex ml-3">
                                <LikeButton
                                  postId={post._id}
                                  userId={user._id}
                                />
                                <CommentBox postId={post._id} />
                                <button
                                  className="ml-10 font-bold mt-2 hover:cursor-pointer"
                                  onClick={() => {
                                    setShowCommentsById((prev) => ({
                                      ...prev,
                                      [post._id]: !prev[post._id],
                                    }));
                                  }}
                                >
                                  {showCommentsById[post._id] ? "Hide" : "Show"}{" "}
                                  Comments
                                </button>
                              </div>
                              <div>
                                {showCommentsById[post._id] && (
                                  <CommentList comments={post.comments || []} />
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )
                ) : activeTab === "Soon" ? (
                  <div className="text-4xl text-white bg-red-600">Soon</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </ClickSpark>
    </ErrorBoundary>
  );
}

export default Dashboard;
