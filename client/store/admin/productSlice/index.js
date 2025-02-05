import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading:false,
    productList:[],

}
//Adding a Product
export const addNewProduct = createAsyncThunk("/products/addnewproduct",async(formData)=>{
    const result = await axios.post("http://localhost:5000/api/admin/products/add",formData,{
        headers:{
            "Content-Type": "application/json"
        }
    });
    return result.data;
})
//Fetching a product
export const fetchAllProduct = createAsyncThunk("/products/fetchallproducts",async()=>{
    const result = await axios.get("http://localhost:5000/api/admin/products/fetchproduct");
    return result?.data;
})
//Editing a product
export const editProduct = createAsyncThunk("/products/editproduct",async(id,formData)=>{
    const result = await axios.put(`http://localhost:5000/api/admin/products/edit/${id}`,formData,{
        headers:{
            'Content-Type':'app;ication/json'
        }
    });
    return result?.data;
})
//Deleting a product
export const deleteProduct = createAsyncThunk("/products/deleteProduct",async(id,formData)=>{
    const result = await axios.delete(`http://localhost:5000/api/admin/products/delete/${id}`);
    return result.data;
})


const adminProductSlice = createSlice({
    name:'adminProducts',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAllProduct.pending,(state)=>{
            state.isLoading = true
        }).addCase(fetchAllProduct.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.productList = action.payload.data;
        }).addCase(fetchAllProduct.rejected,(state)=>{
            state.isLoading=false
            state.productList = [];
        })
    }
})

export default  adminProductSlice.reducer