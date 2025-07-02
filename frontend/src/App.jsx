import { useState } from "react";
import "./index.css";
import Navbar from "./assets/components/Navbar.jsx";
import ClickSpark from "./assets/components/ClickSpark.jsx";
import ErrorBoundary from "./assets/components/ErrorBoundary.jsx";
import MainFeed from "./assets/components/MainFeed.jsx";

function App() {
  

  console.log("App Mounted!!")

  return (
    <ErrorBoundary>
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <div className="bg-black h-screen w-full">
          <div className="  grid grid-flow-row grid-cols-[auto_350px] ml-[300px] h-full ">
            <Navbar />
            <MainFeed />
            <div className="filler text-white border-l-1 border-[#2F3336]    ">
              <div>
                <h2 className="text-4xl font-bold m-2 ">Featured Devs</h2>
                <div className="flex flex-col text-2xl my-10 mx-5 ">
                  <span className="p-2">Developer</span>
                  <span className="p-2">Developer</span>
                  <span className="p-2">Developer</span>
                  <span className="p-2">Developer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClickSpark>
    </ErrorBoundary>
  );
}

export default App;
