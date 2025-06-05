import { useState } from "react";
import "./index.css";
import Navbar from "./assets/components/Navbar";
import ClickSpark from "./assets/components/ClickSpark";

function App() {
  return (
    <>
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <div className="bg-black h-screen w-full">
          <div className="grid grid-flow-row grid-cols-[300px_auto_350px] h-full  ">
            <Navbar />
            <div className="bg-green-400 main"></div>
            <div className="filler text-white  ">
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
    </>
  );
}

export default App;
