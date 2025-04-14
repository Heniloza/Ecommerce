import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addProductReview = createAsyncThunk(
  "/review/addproductReview",
  async (data) => {
    const result = await axios.post(
      `http://localhost:5000/api/shop/review/add`,
      data
    );
    return result?.data;
  }
);

export const getProductReview = createAsyncThunk(
  "/review/getProductReview",
  async (productId) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/review/get/${productId}`
    );
    return result?.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProductReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.isLoading = true;
        state.reviews = action.payload.data;
      })
      .addCase(addProductReview.rejected, (state) => {
        state.isLoading = true;
        state.reviews = [];
      })
      .addCase(getProductReview.fulfilled, (state, action) => {
        state.reviews = action.payload.data;
      });
  },
});

export default reviewSlice.reducer;
