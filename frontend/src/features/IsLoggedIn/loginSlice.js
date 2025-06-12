import { createSlice } from "@reduxjs/toolkit";

export const isLoggedInSlice = createSlice({
    name: "login",
    initialState:{
        value: false,
    },
    reducers:{
        loginToggle: (state) => {
            state.value = !state.value;
        },
        setLogin:(state, action)=>{
            state.value = action.payload
        },
        logout:(state) => {
            state.value = false;
        }
    }
});

export const { setLogin, loginToggle, logout } = isLoggedInSlice.actions;
export default isLoggedInSlice.reducer;