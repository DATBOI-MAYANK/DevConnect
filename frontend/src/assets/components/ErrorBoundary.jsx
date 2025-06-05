import React from "react";

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
        </div>
      );
    }

    return this.props.children;
  }
}
