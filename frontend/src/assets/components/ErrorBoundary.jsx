import React from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }; // trigger fallback UI
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 max-w-md w-full text-center shadow-2xl">
            <div className="mb-6">
              <div className="text-6xl mb-4">😓</div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Oops! Something went wrong
              </h1>
              <p className="text-slate-300 leading-relaxed">
                We encountered an unexpected error. Don't worry, it's not your
                fault!
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Try Again
              </button>

              <Link
                to="/"
                className="block w-full bg-slate-600/50 hover:bg-slate-600/70 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Go Home
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm">
                If the problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
