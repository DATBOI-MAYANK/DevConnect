import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "./features/IsLoggedIn/loginSlice";
import { useLocation, useNavigate } from "react-router-dom";

function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const isPublicRoute =
    location.pathname === "/login" || location.pathname === "/register";
  const refreshIntervalMs = Number(
    import.meta.env.VITE_REFRESH_INTERVAL_MS || 50 * 60 * 1000,
  );
  const [isCheckingSession, setIsCheckingSession] = useState(!isPublicRoute);

  useEffect(() => {
    if (isPublicRoute) {
      setIsCheckingSession(false);
      return;
    }

    let isCurrentRequest = true;
    setIsCheckingSession(true);
    console.log("Running /me check from Layout");

    axios
      .get(`${apiBaseUrl}/me`, { withCredentials: true })
      .catch((err) => {
        console.log("Error from /me:", err);
        if ([401, 403].includes(err.response?.status)) {
          dispatch(logout());
          navigate("/login", { replace: true });
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [apiBaseUrl, dispatch, isPublicRoute, location.pathname, navigate]);

  useEffect(() => {
    if (isPublicRoute || !Number.isFinite(refreshIntervalMs) || refreshIntervalMs <= 0) {
      return;
    }

    const refreshSession = async () => {
      try {
        await axios.post(
          `${apiBaseUrl}/refresh-Token`,
          {},
          { withCredentials: true },
        );
      } catch (err) {
        console.error("Session refresh failed:", err);
      }
    };

    const refreshTimer = window.setInterval(refreshSession, refreshIntervalMs);

    return () => {
      window.clearInterval(refreshTimer);
    };
  }, [apiBaseUrl, isPublicRoute, refreshIntervalMs]);

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <p className="text-sm text-slate-400">Checking your session...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default Layout;
