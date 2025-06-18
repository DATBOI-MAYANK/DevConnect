import { useState } from "react";
import Navbar from "./Navbar";

function Dashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  return (
    <div className="h-screen w-full">
      <div className="grid grid-flow-row grid-cols-[300px_auto] h-full ">
        <Navbar />
        <div className="Dashboard relative bg-black  ">
          {user.CoverImage ? (
            <img
              src={user.CoverImage}
              alt="CoverImage"
              className="w-full h-1/4"
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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
