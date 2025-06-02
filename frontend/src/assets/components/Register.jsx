import axios from "axios";
import { useState } from "react";
import ClickSpark from "./ClickSpark";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatarImage", avatarImage);
      formData.append("coverImage", coverImage);

      console.log("avatarFile----", avatarImage);
      console.log("form--", formData);
      const res = await axios.post(
        "http://localhost:8000/users/api/v1/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Register successful");
    } catch (err) {
      alert("Register failed");
      console.error(err);
    }
  };
  // const handleAvatarImageChange = async (e) => {
  //   try {
  //     const avatarFile = e.target.files[0];
  //     console.log("avatarfile---", avatarFile)
  //     if (avatarFile && avatarFile.type.startsWith("image/")){
  //       setAvatarImage(avatarFile);
  //     }
  //   } catch (error) {
  //     alert("Please upload a valid image file.");
  //   }
  // };
  const handleCoverImageChange = async (e) => {
    try {
      const coverFile = e.target.files[0];
      if (coverFile && coverFile.type.startsWith("image/"))
        setCoverImage(coverFile);
    } catch (error) {
      alert("Please upload a valid image file.");
    }
  };
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
            accept="image/*"
            // onChange={handleAvatarImageChange}
            onChange={(e) => setAvatarImage(e.target.files[0])}
          />
          <label htmlFor="coverImage" className="text-white ml-4">
            Cover Image
          </label>
          <input
            className="w-80 h-9 bg-white rounded-xs mx-4 mb-4 p-2"
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
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
