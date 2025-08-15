import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import store from "./app/store.js";
import { Provider } from "react-redux";
import Layout from "./Layout.jsx";
import LoginPage from "./assets/components/LogIn.jsx";
import Register from "./assets/components/Register.jsx";
import NotFound from "./assets/components/NotFound.jsx";
import ErrorBoundary from "./assets/components/ErrorBoundary.jsx";
import Modal from "react-modal";
import Dashboard from "./assets/components/Dashboard.jsx";
import UserProfile from "./assets/components/UserProfile.jsx";

Modal.setAppElement("#root");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile/:userId",
        element: <UserProfile />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
);
