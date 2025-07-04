import { useEffect, useState } from "react";
import axios from "axios";
import ClickSpark from "../components/ClickSpark";
import LikeButton from "./LikeButton";
function MainFeed() {
  const [posts, setPosts] = useState([]);

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
          posts.map((post) => (
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
        )}
      </div>
    </ClickSpark>
  );
}

export default MainFeed;
