import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};

//For getting all order of user
export const getAllOrderUsers = createAsyncThunk(
  "/order/getAllOrderUsers",
  async () => {
    const respose = await axios.get(
      `http://localhost:5000/api/admin/order/get`
    );
    return respose?.data;
  }
);
//For getting ordern Details
export const getOrderDetailsAdmin = createAsyncThunk(
  "/order/getOrderDetailsAdmin",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/order/details/${id}`
    );
    return response?.data;
  }
);
//For updating Order Status
export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/order/update/${id}`,
      {
        orderStatus,
      }
    );
    return response?.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetailsAdmin: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrderUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrderUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrderUsers.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});
export const { resetOrderDetailsAdmin } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
