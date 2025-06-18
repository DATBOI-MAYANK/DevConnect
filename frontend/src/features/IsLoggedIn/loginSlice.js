import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: JSON.parse(localStorage.getItem("isLoggedIn") || "false"),
};

export const isLoggedInSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("isLoggedIn", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.value = false;
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("user");
    },
  },
});

export const { setLogin, logout } = isLoggedInSlice.actions;
export default isLoggedInSlice.reducer;