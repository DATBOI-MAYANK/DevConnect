import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import ClickSpark from "../components/ClickSpark";
function Dashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
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
  }, [user]);

  return (
    <ClickSpark>
      <div className="h-screen w-full">
        <div className="grid grid-flow-row grid-cols-[300px_auto] h-full ">
          <Navbar />
          <div className="Dashboard relative bg-black  ">
            {user.CoverImage ? (
              <img
                src={user.CoverImage}
                alt="CoverImage"
                className="w-full h-1/4 object-none "
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
              <button className="text-white font-bold  px-20 py-2 border-1 text-3xl">
                Post
              </button>
              <button className="text-white font-bold   px-20 py-2 border-1 text-3xl">
                Media
              </button>
              <button className="text-white font-bold   px-9 py-2 border-1 text-3xl">
                Github Repo
              </button>
              <button className="text-white font-bold   px-10 py-2 border-1 text-3xl">
                Coming Soon...
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}

export default Dashboard;
