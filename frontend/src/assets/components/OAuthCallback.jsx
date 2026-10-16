import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setLogin } from "../../features/IsLoggedIn/loginSlice";

function OAuthCallback() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadAuthenticatedUser = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/me`, {
          withCredentials: true,
        });
        const user = data?.data;

        if (!user?._id) {
          throw new Error("Authenticated user data was not returned");
        }

        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setLogin(true));
        window.dispatchEvent(new Event("userChanged"));

        if (isMounted) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Unable to fetch OAuth user data:", error);
        if (isMounted) {
          navigate("/login", { replace: true });
        }
      }
    };

    loadAuthenticatedUser();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Signing you in...
    </div>
  );
}

export default OAuthCallback;
