import axios from "axios";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/users/api/v1/login",
        { email, password },
        { withCredentials: true }
      );

      alert("Login successful");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="flex  justify-center">
      <form onSubmit={handleLogin} className="bg-white flex flex-col p-5 mt-40 rounded-md">
        <h2 className="text-4xl text-center p-2">Login Form</h2>
        <input
          className="w-80 h-9 rounded-xs m-4 p-2"
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-80 h-9 rounded-xs m-4 p-2"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="text-4xl text-black font-bold   mt-2  border-1 rounded-md hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]" type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
