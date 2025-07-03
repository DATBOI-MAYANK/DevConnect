import { configureStore } from "@reduxjs/toolkit";
import isLoggedInReducer from "../features/IsLoggedIn/loginSlice.js";
import postReducer from "../features/PostSlice/postSlice.js";

export default configureStore({
  reducer: {
    login: isLoggedInReducer,
    posts: postReducer,
  },
});
