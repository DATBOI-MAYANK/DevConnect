import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Layout from "./Layout.jsx";
import LoginPage from "./assets/components/LogIn.jsx";
import SignUp from "./assets/components/SignUp.jsx";
const router = createBrowserRouter([
  {
    "path" : "/",
    "element": <Layout/>,
    "children":[
      {
        "path":"",
        "element": <App/>
      }
      ,{
        "path":"login",
        "element": <LoginPage/>
      },
      {
        "path":"signup",
        "element": <SignUp/>
      }
    ]

  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>
);
