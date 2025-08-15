import axios from "axios";
import { useState } from "react";
import ClickSpark from "./ClickSpark";
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { setLogin } from "../../features/IsLoggedIn/loginSlice";
import ErrorBoundary from "./ErrorBoundary";
import {
  User,
  Mail,
  Lock,
  Image,
  Github,
  FileText,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarImage, setAvatarImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [GithubUsername, setGithubUsername] = useState("");
  const [Bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
        },
      );

      const message = res.data?.message || "Registration successful";
      setIsRegister(true);

      const user = res.data?.data;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
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
        err.response?.data?.message || err.message || "Registration failed";
      setModalMessage(message);
      setIsOpen(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <ClickSpark>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Join Our Community
              </h1>
              <p className="text-slate-400">
                Create your account to get started
              </p>
            </div>

            {/* Registration Form */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Username and Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium text-slate-300 block"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300 block"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full pl-12 pr-12 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Image Upload Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="avatarImage"
                      className="text-sm font-medium text-slate-300 block"
                    >
                      Avatar Image
                    </label>
                    <div className="relative">
                      <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        id="avatarImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarImage(e.target.files[0])}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="coverImage"
                      className="text-sm font-medium text-slate-300 block"
                    >
                      Cover Image
                    </label>
                    <div className="relative">
                      <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* GitHub Username */}
                <div className="space-y-2">
                  <label
                    htmlFor="githubUsername"
                    className="text-sm font-medium text-slate-300 block"
                  >
                    GitHub Username (Optional)
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="githubUsername"
                      type="text"
                      value={GithubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="your-github-username"
                      className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label
                    htmlFor="bio"
                    className="text-sm font-medium text-slate-300 block"
                  >
                    Bio (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <textarea
                      id="bio"
                      value={Bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself..."
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-slate-600/50"></div>
                <span className="px-4 text-slate-400 text-sm">or</span>
                <div className="flex-1 border-t border-slate-600/50"></div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-slate-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-slate-500 text-sm">
              <p>By creating an account, you agree to our Terms of Service</p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setIsOpen(false)}
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          overlayClassName="fixed inset-0 bg-black/75 backdrop-blur-sm"
          contentLabel="Register Modal"
        >
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700/50 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {isRegister ? "Welcome!" : "Error"}
            </h2>
            <p className="text-slate-300 text-center mb-6">{modalMessage}</p>
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
              onClick={() => {
                setIsOpen(false);
                if (isRegister === true) {
                  navigate("/");
                }
              }}
            >
              Continue
            </button>
          </div>
        </Modal>
      </ClickSpark>
    </ErrorBoundary>
  );
};

export default Register;
