import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ClickSpark from "./ClickSpark";
import {
  ArrowLeft,
  Github,
  Calendar,
  MapPin,
  Mail,
  Users,
  FileText,
  Star,
  GitFork,
  ExternalLink,
  Copy,
  Heart,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Image,
  Video,
  Code,
  Activity,
} from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [githubRepos, setGithubRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  // Tab state
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [userId]);

  useEffect(() => {
    if (userProfile?.GithubUsername) {
      fetchGithubRepos();
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/api/v1/profile/${userId}`,
        {
          withCredentials: true,
        },
      );
      setUserProfile(response.data.data);
    } catch (err) {
      setError("Failed to load user profile");
      console.error(err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/api/v1/user/${userId}`,
        {
          withCredentials: true,
        },
      );
      setUserPosts(response.data.data || []);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGithubRepos = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${userProfile.GithubUsername}/repos?sort=updated&per_page=10`,
      );
      setGithubRepos(response.data);
    } catch (err) {
      console.error("Error fetching GitHub repos:", err);
    }
  };

  const openImageModal = (images, index) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setSelectedImage(images[index]);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % currentImages.length
        : (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentImages[newIndex]);
  };

  const getGridClass = (totalImages) => {
    if (totalImages === 1) return "grid-cols-1";
    if (totalImages === 2) return "grid-cols-2";
    if (totalImages === 3) return "grid-cols-2";
    return "grid-cols-2";
  };

  // Filter functions for different content types
  const getTextPosts = () =>
    userPosts.filter(
      (post) =>
        !post.images?.length && !post.videos?.length && !post.githubRepoName,
    );
  const getMediaPosts = () =>
    userPosts.filter(
      (post) => post.images?.length > 0 || post.videos?.length > 0,
    );
  const getGithubPosts = () => userPosts.filter((post) => post.githubRepoName);

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return renderPosts(userPosts);
      case "media":
        return renderPosts(getMediaPosts());
      case "github":
        return renderGithubContent();
      case "about":
        return renderAbout();
      default:
        return renderPosts(userPosts);
    }
  };

  const renderPosts = (posts) => {
    if (posts.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-slate-400 text-xl">No posts found</div>
          <div className="text-slate-500 mt-2">
            {activeTab === "media" && "No media posts yet"}
            {activeTab === "github" && "No GitHub posts yet"}
            {activeTab === "posts" &&
              `${userProfile?.username} hasn't posted anything yet.`}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post._id}
            className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300"
          >
            <div className="text-slate-100 text-lg leading-relaxed mb-4">
              {post.text}
            </div>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div
                className={`grid ${getGridClass(post.images.length)} gap-2 mb-4 max-w-2xl`}
              >
                {post.images.map((img, index) => (
                  <div
                    key={img}
                    className={`relative cursor-pointer group overflow-hidden rounded-lg ${
                      post.images.length === 3 && index === 0
                        ? "row-span-2"
                        : ""
                    }`}
                    onClick={() => openImageModal(post.images, index)}
                  >
                    <img
                      src={img}
                      alt={`post image ${index + 1}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    {post.images.length > 4 && index === 3 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          +{post.images.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Videos */}
            {post.videos && post.videos.length > 0 && (
              <div
                className={`grid ${getGridClass(post.videos.length)} gap-2 mb-4 max-w-2xl`}
              >
                {post.videos.map((vid, index) => (
                  <video
                    key={vid}
                    src={vid}
                    controls
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* GitHub Repo Info */}
            {post.githubRepoName && (
              <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/40 rounded-xl p-5 mb-4 hover:bg-slate-700/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Github className="w-6 h-6 text-slate-400" />
                    <span className="text-white font-semibold text-lg">
                      {post.githubRepoName}
                    </span>
                  </div>
                  <a
                    href={`https://github.com/${userProfile?.GithubUsername}/${post.githubRepoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </a>
                </div>
              </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center space-x-6 pt-4 border-t border-slate-700/50 text-slate-400">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>{post.likes?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments?.length || 0}</span>
              </div>
              <div className="text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  };

  const renderGithubContent = () => (
    <div className="space-y-6">
      {/* GitHub Posts */}
      {getGithubPosts().length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            GitHub Posts
          </h3>
          {renderPosts(getGithubPosts())}
        </div>
      )}

      {/* GitHub Repositories */}
      {githubRepos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Github className="w-5 h-5 mr-2" />
            Repositories
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {githubRepos.map((repo) => (
              <div
                key={repo.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-blue-400 transition-colors flex items-center"
                  >
                    {repo.name}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(repo.clone_url);
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {repo.description && (
                  <p className="text-slate-300 text-sm mb-3">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center space-x-4">
                    {repo.language && (
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center">
                      <GitFork className="w-4 h-4 mr-1" />
                      {repo.forks_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {getGithubPosts().length === 0 && githubRepos.length === 0 && (
        <div className="text-center py-16">
          <Github className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <div className="text-slate-400 text-xl">No GitHub content</div>
          <div className="text-slate-500 mt-2">
            {userProfile?.GithubUsername
              ? "No GitHub repositories or posts found"
              : "No GitHub username set"}
          </div>
        </div>
      )}
    </div>
  );

  const renderAbout = () => (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
      <h3 className="text-2xl font-bold text-white mb-6">
        About {userProfile?.username}
      </h3>

      <div className="space-y-6">
        {userProfile?.Bio && (
          <div>
            <h4 className="text-lg font-semibold text-slate-300 mb-2">Bio</h4>
            <p className="text-slate-400 leading-relaxed">{userProfile.Bio}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-300 mb-3">Stats</h4>
            <div className="space-y-2">
              <div className="flex items-center text-slate-400">
                <FileText className="w-5 h-5 mr-3" />
                <span>{userPosts.length} Total Posts</span>
              </div>
              <div className="flex items-center text-slate-400">
                <Image className="w-5 h-5 mr-3" />
                <span>{getMediaPosts().length} Media Posts</span>
              </div>
              <div className="flex items-center text-slate-400">
                <Code className="w-5 h-5 mr-3" />
                <span>{getGithubPosts().length} GitHub Posts</span>
              </div>
              {githubRepos.length > 0 && (
                <div className="flex items-center text-slate-400">
                  <Github className="w-5 h-5 mr-3" />
                  <span>{githubRepos.length} Public Repositories</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-300 mb-3">
              Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center text-slate-400">
                <Calendar className="w-5 h-5 mr-3" />
                <span>
                  Joined {new Date(userProfile?.createdAt).toLocaleDateString()}
                </span>
              </div>
              {userProfile?.GithubUsername && (
                <div className="flex items-center text-slate-400">
                  <Github className="w-5 h-5 mr-3" />
                  <a
                    href={`https://github.com/${userProfile.GithubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    @{userProfile.GithubUsername}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <ClickSpark>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      </ClickSpark>
    );
  }

  if (error) {
    return (
      <ClickSpark>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
            <p className="text-slate-400">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center mt-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </div>
        </div>
      </ClickSpark>
    );
  }

  return (
    <ClickSpark>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Header with Cover Image */}
        <div className="relative">
          <div className="h-80 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
            {userProfile?.CoverImage && (
              <img
                src={userProfile.CoverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/30"></div>

            <Link
              to="/"
              className="absolute top-6 left-6 flex items-center space-x-2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-black/70 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
          </div>

          {/* Profile Info */}
          <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <img
                  src={userProfile?.AvatarImage || "/default-avatar.png"}
                  alt={userProfile?.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userProfile?.username}
                </h1>
                {userProfile?.Bio && (
                  <p className="text-slate-300 mb-4 max-w-2xl">
                    {userProfile.Bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 mb-8">
            {[
              { id: "posts", label: "All Posts", icon: Activity },
              { id: "media", label: "Media", icon: Image },
              { id: "github", label: "GitHub", icon: Github },
              { id: "about", label: "About", icon: FileText },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-slate-700 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {id === "posts" && (
                  <span className="bg-slate-600 text-slate-300 px-2 py-1 rounded-full text-xs">
                    {userPosts.length}
                  </span>
                )}
                {id === "media" && (
                  <span className="bg-slate-600 text-slate-300 px-2 py-1 rounded-full text-xs">
                    {getMediaPosts().length}
                  </span>
                )}
                {id === "github" && (
                  <span className="bg-slate-600 text-slate-300 px-2 py-1 rounded-full text-xs">
                    {getGithubPosts().length + githubRepos.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pb-8">{renderTabContent()}</div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeImageModal}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <img
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage("prev")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 bg-black/50 rounded-full p-2 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => navigateImage("next")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 bg-black/50 rounded-full p-2 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {currentImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ClickSpark>
  );
};

export default UserProfile;
