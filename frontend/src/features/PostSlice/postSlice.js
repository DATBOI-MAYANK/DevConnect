import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../assets/api/axiosSetup.js";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await api.get("get-posts");
  // console.log("Posts", res);
  return res.data.data;
});

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId }) => {
    const res = await api.post(`posts/${postId}/like`);
    return res.data.data.updatedPost;
  },
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }) => {
    const res = await api.post(`posts/${postId}/addComment`, { text });
    if (!res.data?.data?.updatedPost) {
      throw new Error("Invalid response from addComment API");
    }
    return res.data.data.updatedPost;
  },
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId }) => {
    const res = await api.post(`posts/${postId}/deletePost`);
    if (!res.data?.data?.updatedPost) {
      throw new Error("Invalid response from Delete Post API");
    }
    return res.data.data.updatedPost;
  },
);

const postSlice = createSlice({
  name: "posts",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.list[index] = updated;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.list[index] = updated;
      });
  },
});

export default postSlice.reducer;
