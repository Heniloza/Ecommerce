import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/auth-slice/index";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturn from "./pages/shoppingView/PaypalReturn";
import PaypalCancel from "./pages/shoppingView/PaypalCancel";
import PaymentSuccess from "./pages/shoppingView/PaymentSuccess";
import Search from "./pages/shoppingView/search";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[600px] h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
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
          <Route path="paypalReturn" element={<PaypalReturn />} />
          <Route path="paypalCancel" element={<PaypalCancel />} />
          <Route path="paymentSuccess" element={<PaymentSuccess />} />
          <Route path="search" element={<Search />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="unauthpage" element={<UnAuth />} />
      </Routes>
    </div>
  );
}

export default App;
