import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import ClickSpark from "./ClickSpark";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/users/api/v1/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("User====", res.data.data.user)
      const message = res.data?.message || "Login successful";
      setIsLogin(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      // Trigger a custom event
      window.dispatchEvent(new Event("userChanged"));
      setModalMessage(message);
      setIsOpen(true);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      setModalMessage(message);
      setIsOpen(true);
      console.error(err);
    }
  };

  return (
    <ClickSpark>
      <div className="flex  justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-[#171717] flex flex-col p-5 mt-40 rounded-md"
        >
          <h2 className="text-4xl text-white text-center p-2">Login </h2>
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
            Login
          </button>
          <div className="mt-4 text-center text-white text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </form>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#171717",
            color: "white",
          },
        }}
        contentLabel="Register Modal"
      >
        <h2 className="text-2xl">{modalMessage}</h2>
        <button
          className=" bg-white text-[#171717] text-xl font-bold px-2 py-1 m-2 ml-30 rounded-md "
          onClick={() => {
            setIsOpen(false);
            if (isLogin == true) {
              navigate("/");
              // window.location.reload();
            }
          }}
        >
          OK
        </button>
      </Modal>
    </ClickSpark>
  );
};

export default LoginPage;
