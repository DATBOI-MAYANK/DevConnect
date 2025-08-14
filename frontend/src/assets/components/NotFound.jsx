import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 max-w-lg w-full text-center shadow-2xl">
        <div className="mb-8">
          <div className="text-8xl mb-4">🕵️‍♂️</div>
          <h1 className="text-5xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-300 mb-3">
            Page Not Found
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Looks like you've ventured into uncharted territory. The page you're
            looking for seems to have disappeared into the digital void.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 w-full bg-slate-600/50 hover:bg-slate-600/70 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="pt-6 border-t border-slate-700/50">
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <Search className="w-4 h-4" />
            <span className="text-sm">Lost in DevConnect?</span>
          </div>
          <p className="text-slate-500 text-xs mt-2">
            Double-check the URL or navigate back to familiar territory
          </p>
        </div>
      </div>
    </div>
  );
}
