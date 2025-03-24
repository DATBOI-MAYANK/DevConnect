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
          </div>
        </div>
      </ClickSpark>
    </>
  );
}

export default App;
