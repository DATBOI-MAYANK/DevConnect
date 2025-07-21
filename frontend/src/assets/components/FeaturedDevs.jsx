import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function FeaturedDevs() {
  const [featuredDevs, setFeaturedDevs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/users/api/v1/featured")
      .then((res) => setFeaturedDevs(res.data.data));
  }, []);

  return (
    <div className="filler fixed ml-[700px] bg-black h-screen text-white border-l-1 border-[#2F3336]    ">
      <div>
        <h2 className="text-4xl font-bold m-2 ">Featured Devs</h2>
        {featuredDevs.map((Devs) => {
          <div className="flex flex-col text-2xl my-10 mx-5 ">
            <span className="p-2">Devs</span>
          </div>;
        })}
      </div>
    </div>
  );
}
