import React from "react";
import { useState } from "react";
import ClickSpark from "./ClickSpark";
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/users/api/v1/SignUp",
        {username, email, password },
        { withCredentials: true }
      );

      alert("SignUp successful");
    } catch (err) {
      alert("SignUp failed");
      console.error(err);
    }
  };

  return (
    <ClickSpark>
      <div className="flex  justify-center">
        <form
          onSubmit={handleSignUp}
          className="bg-[#171717] flex flex-col p-5 mt-40 rounded-md"
        >
          <h2 className="text-4xl text-white text-center p-2">SignUp</h2>
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
          <button
            className="text-4xl text-black font-bold   mt-2  border-1 rounded-md hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]"
            type="submit"
          >
            SignUp
          </button>
        </form>
      </div>
    </ClickSpark>
  );
};

export default SignUp;
