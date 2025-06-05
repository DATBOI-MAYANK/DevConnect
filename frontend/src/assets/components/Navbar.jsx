import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo-removebg.png";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("userChanged", handleStorage); // Listen for custom event

    handleStorage();

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userChanged", handleStorage);
    };
  }, []);

  return (
    <>
      <div className=" p-3 navbar text-white">
        <div className="flex">
          {" "}
          <img src={Logo} alt="logo image" className="h-15 w-15 " />{" "}
          <h1 className="text-4xl font-bold pt-3"> DevConnect</h1>
        </div>
        <div className="flex items-center justify-center mt-20">
          <ul className="text-4xl  ">
            <li className="m-4 px-5 py-2 hover:cursor-pointer   hover:bg-white hover:text-black rounded-md  transition-colors duration-400 ease-in-out w-36">
              <Link to="/">Home</Link>
            </li>
            <li className="m-4 px-5 py-2 hover:cursor-pointer  hover:bg-white hover:text-black rounded-md  transition-colors duration-400 ease-in-out   w-44">
              Explore
            </li>
            <li className="m-4 px-5 py-2 hover:cursor-pointer  hover:bg-white hover:text-black rounded-md  transition-colors duration-400 ease-in-out   w-64">
              Notification
            </li>
            <li className="m-4 px-5 py-2 hover:cursor-pointer  hover:bg-white hover:text-black rounded-md  transition-colors duration-400 ease-in-out   w-40">
              More...
            </li>
          </ul>
        </div>
        <button className=" text-4xl text-black font-bold   mt-2 ml-4 px-20 py-2 border-1 rounded-md shadow-[4px_4px_0px_0px_white]  hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]">
          Post
        </button>
        {isLoggedIn && user ? (
          <div className="flex items-center mt-7 ml-2 px-6 py-2 border-1 rounded-md bg-[#212529]">
            <img
              src={user.AvatarImage}
              alt="Profile"
              className="h-10 w-10 rounded-full  mr-2"
            />
            <div className="text-xl font-bold">
              <Link to="/dashboard">{user.username}</Link>
            </div>
          </div>
        ) : (
          <button className=" text-4xl text-black font-bold  mt-4 ml-2  px-20 py-2 border-1 rounded-md shadow-[4px_4px_0px_0px_white] hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]">
            <Link to="/login">Login</Link>
          </button>
        )}
      </div>
    </>
  );
}

export default Navbar;
