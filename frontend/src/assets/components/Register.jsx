import axios from "../api/axiosSetup.js";
import { useState } from "react";
import ClickSpark from "./ClickSpark";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { setLogin } from "../../features/IsLoggedIn/loginSlice";
import ErrorBoundary from "./ErrorBoundary";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [GithubUsername, setGithubUsername] = useState("");
  const [Bio, setBio] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatarImage", avatarImage);
      formData.append("coverImage", coverImage);
      formData.append("GithubUsername", GithubUsername);
      formData.append("Bio", Bio);

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
      // console.log("Response", res.data);
      const message = res.data?.message || "Register successful";
      setIsRegister(true);
      // console.log("message", message);
      // Store only the user object
      // localStorage.setItem("user", JSON.stringify(res.data.data.user));
      const user = res.data?.data;
      // console.log("User to store:", user); // Should log the user object

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        // console.log("User stored in localStorage!");
      } else {
        console.error("User object not found in response:", res.data);
      }
      localStorage.setItem("isLoggedIn", "true");

      // Update Redux login state
      dispatch(setLogin(true));

      setModalMessage(message);
      setIsOpen(true);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Register failed";
      setModalMessage(message);
      setIsOpen(true);
      console.error(err);
    }
  };

  return (
    <ErrorBoundary>
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
              onChange={(e) => setAvatarImage(e.target.files[0])}
            />
            <label htmlFor="coverImage" className="text-white ml-4">
              Cover Image
            </label>
            <input
              className="w-80 h-9 bg-white rounded-xs mx-4 mb-4 p-2"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
            <label htmlFor="GithubUsername" className="text-white ml-4">
              Github Username
            </label>
            <input
              className="w-80 h-9 bg-white rounded-xs mx-4 mb-4 p-2"
              type="GithubUsername"
              value={GithubUsername}
              placeholder="Github Username"
              onChange={(e) => setGithubUsername(e.target.value)}
            />
            <label htmlFor="Bio" className="text-white ml-4">
              Bio
            </label>
            <textarea
              name="Bio"
              value={Bio}
              className="w-80 h-9 bg-white rounded-xs mx-4 mb-4 p-2"
              onChange={(e) => setBio(e.target.value)}
              id=""
            ></textarea>
            <button
              className="text-4xl text-black font-bold   mt-2  border-1 rounded-md hover:cursor-pointer bg-[#1d9bf0] hover:bg-[#48CAE4]"
              type="submit"
            >
              Register
            </button>
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
              if (isRegister === true) {
                navigate("/");
              }
            }}
          >
            OK
          </button>
        </Modal>
      </ClickSpark>
    </ErrorBoundary>
  );
};

export default Register;
