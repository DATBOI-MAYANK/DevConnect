import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div className=" p-3 navbar text-white">
        <h1 className="text-4xl font-bold ">DevConnect</h1>
        <div className="flex items-center justify-center mt-20">
          <ul className="text-4xl ">
            <li className="m-4 px-5 py-2 hover:cursor-pointer hover:bg-[#212529] rounded-4xl  w-36">
              <Link to = "/home"> 
              Home</Link>
              
            </li>
            <li className="m-4 px-5 py-2 hover:cursor-pointer hover:bg-[#212529] rounded-4xl  w-44">
              Explore
            </li>
            <li className="m-4 px-5 py-2 hover:cursor-pointer hover:bg-[#212529] rounded-4xl  w-64">
              Notification
            </li>
            <li className="m-4 px-5 py-2 hover:cursor-pointer hover:bg-[#212529] rounded-4xl  w-40">
              More...
            </li>
          </ul>
        </div>
        <button className="text-4xl text-black font-bold px-15 py-2  mt-12 ml-7 border-2 rounded-4xl hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]">
          Post
        </button>
        <button className="text-4xl text-black font-bold px-15 py-2  mt-2 ml-7 border-2 rounded-4xl hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]">
          <Link to='/login'>
          Login
          </Link>
          
        </button>
      </div>
      <div className="bg-green-400 main"></div>
      <div className="filler text-white  ">
        <div>
          <h2 className="text-4xl font-bold m-2 ">Featured Devs</h2>
          <div className="flex flex-col text-2xl my-10 mx-5 ">
            <span className="p-2">Developer</span>
            <span className="p-2">Developer</span>
            <span className="p-2">Developer</span>
            <span className="p-2">Developer</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
