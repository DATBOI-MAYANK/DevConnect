import axios from "axios";
import { useEffect, useState } from "react";
import { pickFeaturedDevs } from "../utils/randomDev.js";
import {
  Star,
  Users,
  Code,
  TrendingUp,
  Activity,
  Calendar,
  Award,
  Sparkles,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function FeaturedDevs({ isOpen = false, onClose = () => {} }) {
  const [allDevs, setAllDevs] = useState(0);
  const [featuredDevs, setFeaturedDevs] = useState([]);
  const posts = useSelector((state) => state.posts.list);
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/users/api/v1/featured",
        );
        const devs = response.data.data;
        setFeaturedDevs(pickFeaturedDevs(devs, 3));
      } catch (error) {
        console.error("Error fetching featured devs", error?.message);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const allDevs = async () => {
      try {
        const devData = await axios.get(
          "http://localhost:8000/users/api/v1/devs",
        );
        const devs = devData.data.data.length;

        setAllDevs(devs);
      } catch (error) {
        console.error("Error fetching featured devs", error);
      }
    };
    allDevs();
  }, []);

  // Mock data for additional sections const devData = await axios.get(
  //   "http://localhost:8000/users/api/v1/devs",
  // );
  // console.log("Devs", devData.length);
  const trendingTopics = [
    { name: "React 18", posts: 1234 },
    { name: "TypeScript", posts: 987 },
    { name: "Next.js", posts: 756 },
    { name: "Node.js", posts: 643 },
    { name: "Python", posts: 521 },
  ];

  const stats = {
    totalDevs: allDevs || 0,
    activeToday: allDevs,
    totalPosts: posts.length,
  };

  const upcomingEvents = [
    { title: "React Conf 2024", date: "Dec 15", type: "Conference" },
    { title: "JS Meetup", date: "Dec 20", type: "Meetup" },
    { title: "Open Source Day", date: "Dec 25", type: "Workshop" },
  ];

  return (
    <div
      className={`fixed top-0 right-0 h-screen w-[300px] xl:w-[350px] bg-gradient-to-b from-slate-900 via-blue-900/20 to-slate-900 backdrop-blur-xl border-l border-slate-700/50 text-white overflow-y-auto transform transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0 lg:fixed lg:right-0 lg:top-0 lg:h-screen lg:w-[350px]`}
    >
      <div className="p-6 space-y-6">
        <div className="lg:hidden flex items-center justify-between">
          <h2 className="text-lg font-semibold">Featured</h2>
          <button
            className="p-2 rounded-lg hover:bg-slate-800/60"
            onClick={onClose}
            aria-label="Close featured devs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Featured Devs Section */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold">Featured Devs</h2>
          </div>

          <div className="space-y-3">
            {featuredDevs.map((dev) => (
              <div
                key={dev._id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={dev?.AvatarImage}
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover border-2 border-slate-600/50 group-hover:border-blue-400/50 transition-colors duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 truncate">
                    {dev?.username || "Unknown"}
                  </div>
                  <div className="text-sm text-slate-400 truncate">
                    Full-stack Developer
                  </div>
                </div>
                <button
                  className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-medium opacity-60 cursor-not-allowed whitespace-nowrap"
                  disabled
                >
                  Follow
                </button>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 border-t border-slate-700/50 pt-4">
            Show more
          </button>
        </div>

        {/* Community Stats */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold">Community Stats</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <div className="text-2xl font-bold text-blue-400">
                {stats.totalDevs.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">Developers</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <div className="text-2xl font-bold text-green-400">
                {stats.activeToday}
              </div>
              <div className="text-sm text-slate-400">Active Today</div>
            </div>
          </div>

          <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30 mt-4">
            <div className="text-2xl font-bold text-purple-400">
              {stats.totalPosts.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Posts</div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold">Trending</h2>
          </div>

          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={topic.name}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white group-hover:text-blue-400 transition-colors duration-300">
                      #{topic.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {topic.posts.toLocaleString()} posts
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold">Upcoming Events</h2>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
                    {event.title}
                  </div>
                  <div className="text-sm px-2 py-1 bg-purple-600/20 text-purple-300 rounded-md border border-purple-500/30">
                    {event.type}
                  </div>
                </div>
                <div className="text-sm text-slate-400">{event.date}</div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 border-t border-slate-700/50 pt-4">
            View all events
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-blue-300 font-medium transition-all duration-200 hover:scale-105">
              <Code className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm">Share Code</div>
            </button>
            <button className="p-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl text-green-300 font-medium transition-all duration-200 hover:scale-105">
              <Users className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm">Find Devs</div>
            </button>
            <button className="p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl text-purple-300 font-medium transition-all duration-200 hover:scale-105">
              <Award className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm">Challenges</div>
            </button>
            <button className="p-3 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-xl text-orange-300 font-medium transition-all duration-200 hover:scale-105">
              <TrendingUp className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm">Analytics</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm pb-6">
          <div className="mb-2">DevConnect © 2024</div>
          <div className="space-x-4">
            <a
              href="#"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
