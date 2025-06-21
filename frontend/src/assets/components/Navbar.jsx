import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/IsLoggedIn/loginSlice";
import Logo from "../Logo/Logo-removebg.png";
import ErrorBoundary from "./ErrorBoundary";
import PostModal from "./PostModel.jsx";

function Navbar() {
  const isLoggedIn = useSelector((state) => state.login.value);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // Update user info whenever login state changes
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
  }, [isLoggedIn]);

  return (
    <ErrorBoundary>
      <div className="p-3 navbar text-white border-r-1 border-[#2F3336]">
        <div className="flex">
          <img src={Logo} alt="logo image" className="h-15 w-15" />
          <h1 className="text-4xl font-bold pt-3"> DevConnect</h1>
        </div>
        <div className="flex items-center justify-center mt-20 ">
          <ul className="text-4xl">
            <li className="m-4 px-5 py-2 hover:cursor-pointer hover:bg-white hover:text-black rounded-md transition-colors duration-400 ease-in-out w-36">
              <Link to="/">Home</Link>
            </li>
            <li className="m-4 px-5 py-2 hover:cursor-pointer hover:bg-white hover:text-black rounded-md transition-colors duration-400 ease-in-out w-44">
              Explore
            </li>
            <li className="m-4 px-5 py-2 hover:cursor-pointer hover:bg-white hover:text-black rounded-md transition-colors duration-400 ease-in-out w-64">
              Notification
            </li>
            <li className="m-4 px-5 py-2 hover:cursor-pointer hover:bg-white hover:text-black rounded-md transition-colors duration-400 ease-in-out w-40">
              More...
            </li>
          </ul>
        </div>
        <>
          <button
            className="text-4xl text-black font-bold mt-2 ml-4 px-20 py-2 border-1 rounded-md shadow-[4px_4px_0px_0px_white] hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]"
            onClick={() => setIsPostModalOpen(true)}
          >
            Post
          </button>
          <PostModal isOpen={isPostModalOpen} onRequestClose={() => setIsPostModalOpen(false)} />
        </>
        {isLoggedIn && user ? (
          <div className="flex items-center mt-7 ml-2 px-6 py-2 border-1 rounded-md bg-black">
            <img
              src={user.AvatarImage}
              alt="Profile"
              className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
            />
            <div className="text-xl ml-5 font-bold">
              <Link to="/dashboard">{user.username}</Link>
            </div>
            <button
              className="ml-7 bg-white text-black p-1 rounded-md hover:bg-[#1d9bf0]"
              onClick={() => dispatch(logout(), navigate("/"))}
            >
              Logout
            </button>
          </div>
        ) : (
          <button className="text-4xl text-black font-bold mt-4 ml-2 px-20 py-2 border-1 rounded-md shadow-[4px_4px_0px_0px_white] hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]">
            <Link to="/login">Login</Link>
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default Navbar;
