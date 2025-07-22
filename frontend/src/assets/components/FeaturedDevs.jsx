import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { pickFeaturedDevs } from "../utils/randomDev.js";

export default function FeaturedDevs() {
  const [allDevs, setAllDevs] = useState([]);
  const [featuredDevs, setFeaturedDevs] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/users/api/v1/featured"
        );

        const devs = response.data.data;

        setAllDevs(devs);
        setFeaturedDevs(pickFeaturedDevs(devs, 3));
      } catch (error) {
        console.error("Error fetching featured devs", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="filler fixed ml-[700px] bg-black h-screen text-white border-l-1 border-[#2F3336]    ">
      <div>
        <h2 className="text-4xl font-bold m-2 ">Featured Devs</h2>
        {featuredDevs.map((dev) => (
          // <div key={dev._id} className="flex flex-col text-2xl my-10 mx-5">
          //   <span className="p-2">{dev.username}</span>
          // </div>
          <div className="flex my-3 ml-3">
            <img
              src={dev?.AvatarImage}
              alt="Profile"
              className="h-10 w-10 rounded-full mr-2 object-cover border-1 border-[#2F3336]"
            />
            <strong className="text-lg font-bold ml-2">
              {dev?.username || "Unknown"}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
