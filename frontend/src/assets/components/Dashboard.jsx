import React from "react";
import Navbar from "./Navbar";

function Dashboard() {
  return (
    <div className="h-screen w-full">
      <div className="grid grid-flow-row grid-cols-[300px_auto] h-full ">
        <Navbar />
        <div className="Dashboard bg-yellow-600   ">
            
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
