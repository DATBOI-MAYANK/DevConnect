import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios"; // adjust path if needed
import { logout } from "./features/IsLoggedIn/loginSlice";
import { useLocation } from "react-router-dom";

function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    console.log("Running /me check from Layout");

    if (location.pathname === "/login" || location.pathname === "/register")return;

    axios
      .get("http://localhost:8000/users/api/v1/me", { withCredentials: true })
      .catch((err) => {
        console.log("Error from /me:", err);
        if (err.response && err.response.status === 401) {
          dispatch(logout());
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      });
  }, [dispatch, location.pathname]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default Layout;
