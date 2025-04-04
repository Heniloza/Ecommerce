import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductSlice from "./admin/productSlice/index.js";
import shoppingProductSlice from "./shop/productSlice/index.js";
import shoppingCartSlice from "./shop/cartSlice/index.js";
import shopAddressSlice from "./shop/addressSlice/index.js";
import shopOrderSlice from "./shop/orderSlice/index.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductSlice,
    shopProducts: shoppingProductSlice,
    shopCart: shoppingCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
  },
});

export default store;
