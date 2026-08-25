import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../assets/api/axiosSetup";

export const followUser = createAsyncThunk(
  "follow/followUser",
  async ({ userId }) => {
    const res = await api.post(`follow/${userId}`);
    return res.data.data;
  },
);

export const fetchFollowRecords = createAsyncThunk(
  "follow/fetchRecords",
  async () => {
    const res = await api.get("/follow-record");
    return res.data.data;
  },
);

const initialState = {
  following: [],
  followers: [],
  status: "idle",
  error: null,
};

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async ({ userId }) => {
    const res = await api.delete(`unfollow/${userId}`);
    return res.data.data;
  },
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  builder
    .addCase(fetchFollowRecords.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchFollowRecords.fulfilled, (state, action) => {
      state.status = "succeeded";

      state.following = action.payload.followingRecord;
      state.followers = action.payload.followerRecord;
    })
    .addCase(fetchFollowRecords.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
    .addCase(followUser.pending, (state) => {
      state.status = "loading";
    })
    .addCase(followUser.fulfilled, (state, action) => {
      state.following.push(action.payload);
      state.status = "succeeded";
    })
    .addCase(followUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
    .addCase(unfollowUser.fulfilled, (state, action) => {
      const unfollowedId = action.meta.arg.userId;
      state.following = state.following.filter(
        (record) => String(record.followee) !== String(unfollowedId),
      );
      state.status = "succeeded";
    })
    .addCase(unfollowUser.pending, (state) => {
      state.status = "loading";
    })
    .addCase(unfollowUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default followSlice.reducer;
