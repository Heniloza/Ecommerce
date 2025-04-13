import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
};

export const getSeearchProducts = createAsyncThunk(
  "/products/getSeearchProducts",
  async (keyword) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/search/${keyword}`
    );
    return response?.data;
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchresult: (state) => {
      state.searchResults = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSeearchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSeearchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(getSeearchProducts.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  },
});

export const { resetSearchresult } = searchSlice.actions;

export default searchSlice.reducer;
