import { useState } from "react";
import "./index.css";
import Navbar from "./assets/components/Navbar";

function App() {
  return (
    <>
      <div className="bg-black h-screen w-full">
        <div className="grid grid-flow-row grid-cols-[300px_auto_350px] h-full ">
          <Navbar />
          
        </div>
      </div>
    </>
  );
}

export default App;
