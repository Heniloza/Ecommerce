import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLayout from "./components/adminView/AdminLayout";
import AdminDashboard from "./pages/adminView/AdminDashboard";
import AdminFeatures from "./pages/adminView/AdminFeatures";
import AdminOrders from "./pages/adminView/AdminOrders";
import AdminProducts from "./pages/adminView/AdminProducts";
import NotFound from "./pages/notFound/NotFound";
import ShoppingLayout from "./components/shoppingView/ShoppingLayout";
import Home from "./pages/shoppingView/Home";
import Listing from "./pages/shoppingView/Listing";
import CheckOut from "./pages/shoppingView/CheckOut";
import Account from "./pages/shoppingView/Account";
import CheckAuth from "./components/common/CheckAuth";
import UnAuth from "./pages/UnAuth";
import { useSelector } from "react-redux";

function App() {

  const {user,isAuthenticated} = useSelector(state=>state.auth);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* Common components */}

      <Routes>
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="account" element={<Account />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="listing" element={<Listing />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="unauthpage" element={<UnAuth /> }/>

      </Routes>
    </div>
  );
}

export default App;
