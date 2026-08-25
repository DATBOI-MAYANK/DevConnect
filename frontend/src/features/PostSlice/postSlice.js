import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../assets/api/axiosSetup.js";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await api.get("get-posts");
  return res.data.data;
});

export const Like = createAsyncThunk("posts/Like", async ({ postId }) => {
  const res = await api.post(`posts/${postId}`);
  return res.data.data;
});

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
    const res = await api.delete(`posts/${postId}/deletePost`);
    if (!res.data?.data?.deletedPostId) {
      throw new Error("Failed to delete post");
    }
    return res.data.data.deletedPostId;
  },
);

const updatePostInState = (state, payload) => {
  const updated = payload;
  const index = state.list.findIndex((p) => p._id === updated._id);
  if (index !== -1) state.list[index] = updated;
};

const postSlice = createSlice({
  name: "posts",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(Like.fulfilled, (state, action) => {
        const updated = action.payload;
        const post = state.list.find((p) => p._id === updated.id);

        if (post) {
          post.isLiked = action.payload.isLiked;
          post.likeCount = action.payload.likeCount;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        updatePostInState(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        state.list = state.list.filter((p) => p._id !== postId);
      });
  },
});

export default postSlice.reducer;
