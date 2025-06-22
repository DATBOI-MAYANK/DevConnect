import { useEffect, useState } from "react";
import axios from "axios";
import ClickSpark from "../components/ClickSpark";
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
      <div className="Data h-20 absolute  w-full p-4 rounded  ">
        {posts.length == 0 ? (
          <div className="text-white">No Posts Found </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="mb-4 p-2 bg-black text-white rounded shadow"
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
                <div className="flex gap-2 mt-2">
                  {post.images.map((img, indx) => (
                    <img
                      src={img}
                      key={indx}
                      alt="post"
                      className="w-24 h-24 object-cover rounded"
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
            </div>
          ))
        )}
      </div>
    </ClickSpark>
  );
}

export default MainFeed;
