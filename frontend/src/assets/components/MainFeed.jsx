import { useEffect, useState } from "react";
import axios from "axios";
import ClickSpark from "../components/ClickSpark.jsx";
import LikeButton from "./LikeButton.jsx";
import CommentBox from "./CommentBox.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../features/PostSlice/postSlice.js";

function MainFeed() {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const posts = useSelector((state) => state.posts.list);
  const dispatch = useDispatch();
  const [repoDetails, setRepoDetails] = useState([]);

  useEffect(() => {
    const postRepoName = posts
      .filter((post) => post.githubRepoName)
      .map((post) => post.githubRepoName);
    if (!user.GithubUsername || postRepoName.length === 0) return;

    async function fetchSpecificRepos() {
      try {
        const promises = postRepoName.map((name) =>
          axios.get(
            `https://api.github.com/repos/${user.GithubUsername}/${name}`
          )
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
  

  return (
    <ClickSpark>
      <div className="Data h-20 absolute  w-full py-4 rounded  ">
        {posts.length == 0 ? (
          <div className="text-white">No Posts Found </div>
        ) : (
          posts.map((post) => {
            const repoInfo = repoDetails.find(
              (r) => r.name === post.githubRepoName
            );
            return (
              <div
                key={post._id}
                className="mb-4 p-3 bg-black text-white   border-b-1 border-[#2F3336]"
              >
                <div className="flex mb-2">
                  <img
                    src={post.author?.AvatarImage}
                    alt="Profile"
                    className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
                  />
                  <strong>{post.author?.username || "Unknown"}</strong>
                </div>

                <div className="text-xl ml-10 ">{post.text}</div>
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
                {repoInfo && (
                  <div className="repo-card border border-[#2F3336] p-2 rounded-lg  ml-10 m-5">
                    <div className="flex mb-2">
                      <img
                        src={repoInfo.owner.avatar_url}
                        alt={`${repoInfo.owner.login} avatar`}
                        className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
                      />
                      <strong className="mt-2">{repoInfo.owner.login}</strong>
                    </div>
                    <a
                      href={repoInfo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-bold text-2xl my-5  "
                    >
                      <strong>{repoInfo.name}</strong>
                    </a>
                    <div className="my-2">
                      <label className=" underline ">Description</label>
                      <p className="pt-2">{repoInfo.description}</p>
                      <span className="my-2">
                        ⭐ {repoInfo.stargazers_count}
                      </span>
                    </div>
                    <div className="my-2">
                      <label className="block underline my-1 ">Language</label>
                      <p>{repoInfo.language}</p>
                    </div>
                  </div>
                )}

                <div className="flex ml-3">
                  <LikeButton postId={post._id} userId={user._id} />
                  <CommentBox postId={post._id} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </ClickSpark>
  );
}

export default MainFeed;
