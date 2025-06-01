import React from "react";
import { useState } from "react";
import ClickSpark from "./ClickSpark";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarImage , setAvatarImage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/users/api/v1/register",
        {username, email, password },
        { withCredentials: true }
      );

      alert("Register successful");
    } catch (err) {
      alert("Register failed");
      console.error(err);
    }
  };
  const handleImageChange = async (e) => {
    try {
      const avatarFile = e.target.files[0];
      if(avatarFile && avatarFile.type.startsWith("image/")) setAvatarImage(avatarFile)
    } catch (error) {
      alert("Please upload a valid image file.");
    }
  }
  return (
    <ClickSpark>
      <div className="flex  justify-center">
        <form
          onSubmit={handleRegister}
          className="bg-[#171717] flex flex-col p-5 mt-40 rounded-md"
        >
          <h2 className="text-4xl text-white text-center p-2">Register</h2>
          <label htmlFor="username" className="text-white ml-4 mt-2">
            Username
          </label>
          <input
            className="w-80 h-9 bg-white rounded-xs mx-4 mb-4 p-2"
            type="username"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email" className="text-white ml-4 mt-2">
            Email
          </label>
          <input
            className="w-80 h-9 bg-white rounded-xs mx-4 mb-4 p-2"
            type="email"
            value={email}
            placeholder="me@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="text-white ml-4">
            Password
          </label>
          <input
            className="w-80 h-9 bg-white rounded-xs mx-4 mb-4 p-2"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="avatarImage" className="text-white ml-4">
            Avatar Image
          </label>
          <input
            className="w-80 h-9 bg-white rounded-xs mx-4 mb-4 p-2"
            type="file"
            value={avatarImage}
            accept="image/*"
            onChange={ handleImageChange}
          />
          <button
            className="text-4xl text-black font-bold   mt-2  border-1 rounded-md hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </ClickSpark>
  );
};

export default Register;
