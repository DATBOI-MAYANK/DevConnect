import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../assets/api/axiosSetup";

export const followUser = createAsyncThunk(
  "follow/followUser",
  async ({ userId }) => {
    const res = await api.post(`follow/${userId}`);
    return res.data.data;
  },
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async ({ userId }) => {
    const res = await api.delete(`unfollow/${userId}`);
    return res.data.data;
  },
);

const followSlice = createSlice({
  name: "follow",
});

export default followSlice;
