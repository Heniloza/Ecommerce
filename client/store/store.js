import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice'
import adminProductSlice from './admin/productSlice/index.js'
import shoppingProductSlice from './shop/productSlice/index.js'



const store = configureStore({
    reducer:{
        auth:authReducer,
        adminProducts:adminProductSlice,   
        shopProducts:shoppingProductSlice 
    }
})

export default store;