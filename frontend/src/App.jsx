import { useState } from "react";
import "./index.css";
import Navbar from "./assets/components/Navbar.jsx";
import ClickSpark from "./assets/components/ClickSpark.jsx";
import ErrorBoundary from "./assets/components/ErrorBoundary.jsx";
import MainFeed from "./assets/components/MainFeed.jsx";
import FeaturedDevs from "./assets/components/FeaturedDevs.jsx";
import { Menu, Users } from "lucide-react";

function App() {
  console.log("App Mounted!!");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);

  return (
    <ErrorBoundary>
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <div className="min-h-screen w-full">
          <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-700/50">
            <div className="flex items-center justify-between px-4 py-3 text-white">
              <button
                className="p-2 rounded-lg hover:bg-slate-800/60"
                onClick={() => setIsNavOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="text-lg font-semibold">DevConnect</div>
              <button
                className="p-2 rounded-lg hover:bg-slate-800/60"
                onClick={() => setIsFeaturedOpen(true)}
                aria-label="Open featured devs"
              >
                <Users className="w-6 h-6" />
              </button>
            </div>
          </div>

          {(isNavOpen || isFeaturedOpen) && (
            <div
              className="lg:hidden fixed inset-0 z-30 bg-black/60"
              onClick={() => {
                setIsNavOpen(false);
                setIsFeaturedOpen(false);
              }}
            />
          )}

          <Navbar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
          <FeaturedDevs
            isOpen={isFeaturedOpen}
            onClose={() => setIsFeaturedOpen(false)}
          />

          <main className="pt-16 lg:pt-0 lg:ml-[300px] lg:mr-[350px]">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <MainFeed />
            </div>
          </main>
        </div>
      </ClickSpark>
    </ErrorBoundary>
  );
}

export default App;
