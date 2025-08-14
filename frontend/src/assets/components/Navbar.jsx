import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/IsLoggedIn/loginSlice";
import Logo from "../Logo/Logo-removebg.png";
import ErrorBoundary from "./ErrorBoundary";
import CreatePostModal from "./CreatePostModel.jsx";
import { Home, Search, Bell, MoreHorizontal, Plus, LogOut } from "lucide-react";

function Navbar() {
  const isLoggedIn = useSelector((state) => state.login.value);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
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
      <>
        <div className="navbar fixed left-0 top-0 h-screen w-[300px] bg-gradient-to-b from-slate-900 via-blue-900/30 to-slate-900 backdrop-blur-xl border-r border-slate-700/50 text-white">
          {/* Logo Section */}
          <div className="flex items-center p-6 border-b border-slate-700/30">
            <img src={Logo} alt="logo image" className="h-12 w-12 mr-3" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              DevConnect
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-8">
            <nav className="space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-4 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-slate-800/50 hover:text-blue-400 group"
              >
                <Home className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Home</span>
              </Link>

              <button className="flex items-center space-x-4 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-slate-800/50 hover:text-blue-400 group w-full text-left">
                <Search className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Explore</span>
              </button>

              <button className="flex items-center space-x-4 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-slate-800/50 hover:text-blue-400 group w-full text-left">
                <Bell className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Notifications</span>
              </button>

              <button className="flex items-center space-x-4 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-slate-800/50 hover:text-blue-400 group w-full text-left">
                <MoreHorizontal className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>More...</span>
              </button>
            </nav>
          </div>

          {/* Post Button */}
          <div className="px-4 mb-6">
            <button
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => setIsPostModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              <span className="text-lg">Create Post</span>
            </button>
            <CreatePostModal
              isOpen={isPostModalOpen}
              onRequestClose={() => setIsPostModalOpen(false)}
            />
          </div>

          {/* User Profile / Login Section */}
          <div className="absolute bottom-6 left-4 right-4">
            {isLoggedIn && user ? (
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative">
                    <img
                      src={user.AvatarImage}
                      alt="Profile"
                      className="h-12 w-12 rounded-full object-cover border-2 border-slate-600/50"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  </div>
                  <div className="flex-1">
                    <Link
                      to="/dashboard"
                      className="block text-white font-semibold hover:text-blue-400 transition-colors duration-200"
                    >
                      {user.username}
                    </Link>
                    <div className="text-sm text-slate-400">Online</div>
                  </div>
                </div>

                <button
                  className="flex items-center justify-center space-x-2 w-full bg-slate-700/50 hover:bg-red-600/20 hover:border-red-500/50 text-slate-300 hover:text-red-400 py-2 px-4 rounded-lg border border-slate-600/50 transition-all duration-300"
                  onClick={() => dispatch(logout(), navigate("/"))}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </>
    </ErrorBoundary>
  );
}

export default Navbar;
