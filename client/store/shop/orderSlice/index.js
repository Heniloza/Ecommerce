import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  approvalUrl: null,
  isLoading: false,
  orderId: null,
};

export const createOrder = createAsyncThunk(
  "/order/createOrder",
  async (orderData) => {
    const respose = await axios.post(
      `http://localhost:5000/api/shop/order/create`,
      orderData
    );
    return respose?.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {},
  extraReducers: (builer) => {
    builer
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalUrl = action.payload.approvalUrl;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalUrl = null;
        state.orderId = null;
      });
  },
});

export default shoppingOrderSlice.reducer;
