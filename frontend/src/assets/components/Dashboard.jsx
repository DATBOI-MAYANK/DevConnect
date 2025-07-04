import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import ClickSpark from "../components/ClickSpark.jsx";
import LikeButton from "./LikeButton.jsx";
import { fetchPosts } from "../../features/PostSlice/postSlice";

function Dashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.list);

  const [activeTab, setActiveTab] = useState("");
  const userPosts = posts.filter((post) => post.author?._id === user?._id);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
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
                  userPosts.map((post) => (
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
                        <strong>{post.author?.username || "Unknown"}</strong>
                      </div>
                      <div className="text-xl ml-10">{post.text}</div>

                      {post.images && post.images.length > 0 && (
                        <div className="flex gap-2 ml-10 mt-2">
                          {post.images.map((img) => (
                            <img
                              src={img}
                              key={img}
                              alt="post"
                              className="media-img"
                              onLoad={(e) => {
                                const el = e.target;
                                el.classList.remove("landscape", "portrait");
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
                        <div className="flex gap-2 mt-2">
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
                      {post.githubRepo && (
                        <div>
                          <a
                            href={post.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 ml-9 underline"
                          >
                            {post.githubRepo}
                          </a>
                        </div>
                      )}
                      <LikeButton postId={post._id} userId={user._id} />
                    </div>
                  ))
                )
              ) : activeTab === "Media" ? (
                userPosts.length === 0 ? (
                  <div className="text-white text-4xl">No Posts Found</div>
                ) : (
                  <div className="mb-4 p-3 bg-black text-white border-b-1 border-[#2F3336]">
                    {userPosts
                      .filter(
                        (post) =>
                          (post.images && post.images.length > 0) ||
                          (post.videos && post.videos.length > 0)
                      )
                      .map((post) => (
                        <div key={post._id}>
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
                            <div className="flex gap-2 ml-10  mt-2">
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
                            <div className="flex gap-2 mt-2">
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
                          <LikeButton postId={post._id} userId={user._id} />
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
                      .filter((post) => post.githubRepo)
                      .map((post) => (
                        <div key={post._id}>
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
                          <a
                            href={post.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 ml-9 underline"
                          >
                            {post.githubRepo}
                          </a>
                        </div>
                      ))}
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
  );
}

export default Dashboard;
