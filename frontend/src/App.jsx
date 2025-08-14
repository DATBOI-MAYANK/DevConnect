import { useState } from "react";
import "./index.css";
import Navbar from "./assets/components/Navbar.jsx";
import ClickSpark from "./assets/components/ClickSpark.jsx";
import ErrorBoundary from "./assets/components/ErrorBoundary.jsx";
import MainFeed from "./assets/components/MainFeed.jsx";
import FeaturedDevs from "./assets/components/FeaturedDevs.jsx";

function App() {
  console.log("App Mounted!!");

  return (
    <ErrorBoundary>
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <div className="h-screen w-full">
          <div className="  grid grid-flow-row grid-cols-[auto_350px] ml-[300px] h-full ">
            <Navbar />
            <MainFeed />

            <FeaturedDevs />
          </div>
        </div>
      </ClickSpark>
    </ErrorBoundary>
  );
}

export default App;
