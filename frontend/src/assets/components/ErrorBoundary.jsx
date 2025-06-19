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
        <div className="flex flex-col items-center justify-center h-screen text-center text-red-600">
          <h1 className="text-3xl font-bold">😓 Oops! Something went wrong.</h1>
          <p className="text-lg mt-2">
            Try refreshing or go back to the home page.
          </p>
          <button className="m-4 px-5 py-2 hover:cursor-pointer hover:bg-white hover:text-black rounded-md transition-colors duration-400 ease-in-out w-36">
            <Link to="/">Home</Link>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
