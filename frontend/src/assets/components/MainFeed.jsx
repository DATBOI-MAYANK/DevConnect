import { useEffect, useState } from "react";
import axios from "axios";
import ClickSpark from "../components/ClickSpark.jsx";
import LikeButton from "./LikeButton.jsx";
import useFetchRepos from "../Hooks/useFetchRepos.jsx";
function MainFeed() {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [posts, setPosts] = useState([]);
  const [repoDetails, setRepoDetails] = useState([]);
  const repos = useFetchRepos(user?.GithubUsername);

  // console.log("Repos" , repos)
  // const postRepoName =  posts.filter(post => post.githubRepoName).map(post => post.githubRepoName);
  // console.log("Posts repo name",repoName)
  // const userRepoName = repos.map((repo) => repo.name);
  // posts.forEach(post => {
  //   if (post.githubRepoName )
  // })
  // console.log("User Repo" , userRepoName)

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
        // console.log("Results:", results);
        // console.log("Promises:", promises);
        const repoDetails = results.map((r) => r.data);
        console.log("repoDatails", repoDetails);
        setRepoDetails(repoDetails);
      } catch (err) {
        console.error("Error fetching repos:", err);
      }
    }

    fetchSpecificRepos();
  }, [user?.GithubUsername, posts]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/users/api/v1/get-posts", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setPosts(res.data.data);
      })
      .catch((err) => {
        console.error("Failed To Fetch Posts:", err);
      });
  }, []);

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
                {/* {repoInfo && (
                  <div className="repo-info ml-10 m-5">
                    <div className="flex mb-2">
                      <img
                        src={repoInfo[0].owner.avatar_url}
                        alt={`${repoInfo.owner.login} avatar`}
                        className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
                      />
                      <strong>{post.author?.username || "Unknown"}</strong>
                    </div>
                    <a href={repoInfo.html_url} target="_blank" rel="noopener">
                      <strong>{repoInfo.name}</strong>
                    </a>
                    <p>{repoInfo.description}</p>
                    <span>⭐ {repoInfo.stargazers_count}</span>
                  </div>
                )} */}
                {/* { repoDetails && repoDetails.map((repo) => (
                  <div
                    key={repo.id}
                    className="repo-card border border-[#2F3336] p-2 rounded-lg  ml-10 m-5"
                  >
                    <div className="flex mb-2">
                      <img
                        src={repo.owner.avatar_url}
                        alt={`${repo.owner.login} avatar`}
                        className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
                      />
                      <strong className="mt-2">
                        {repo.owner.login || "Unknown"}
                      </strong>
                    </div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-bold text-2xl my-5  "
                    >
                      {repo.name}
                    </a>
                    <div className=" p-2 border-1 border-[#2F3336] rounded-lg  mb-2">
                      <label className="block underline ">Language</label>
                      <p>{repo.language}</p>
                    </div>
                    <div className=" p-2 border-1 border-[#2F3336] rounded-lg  mb-2">
                      <label className="block underline ">Description</label>
                      <p>{repo.description}</p>
                      <p className="my-2"> ⭐ {repo.stargazers_count}</p>
                    </div>
                    Add description, stars, etc.
                  </div>
                ))} */}
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
                    <span className="my-2">⭐ {repoInfo.stargazers_count}</span>
                   </div>
                    <div className="my-2">
                      <label className="block underline my-1 ">Language</label>
                      <p>{repoInfo.language}</p>
                    </div>
                  </div>
                )}

                <LikeButton postId={post._id} userId={user._id} />
              </div>
            );
          })
        )}
      </div>
    </ClickSpark>
  );
}

export default MainFeed;
