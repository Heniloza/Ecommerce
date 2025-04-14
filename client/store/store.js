import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductSlice from "./admin/productSlice/index.js";
import shoppingProductSlice from "./shop/productSlice/index.js";
import shoppingCartSlice from "./shop/cartSlice/index.js";
import shopAddressSlice from "./shop/addressSlice/index.js";
import shopOrderSlice from "./shop/orderSlice/index.js";
import searchSlice from "./shop/searchSlice/index.js";
import reviewSlice from "./shop/reviewSlice/index.js";

import adminOrderSlice from "./admin/orderSlice/index.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductSlice,
    adminOrder: adminOrderSlice,
    shopProducts: shoppingProductSlice,
    shopCart: shoppingCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: searchSlice,
    shopReview: reviewSlice,
  },
});

export default store;
