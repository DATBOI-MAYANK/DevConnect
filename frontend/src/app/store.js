import { configureStore } from "@reduxjs/toolkit";
import isLoggedInReducer from "../features/IsLoggedIn/loginSlice";

export default configureStore({
  reducer: {
    login: isLoggedInReducer,
  },
});
