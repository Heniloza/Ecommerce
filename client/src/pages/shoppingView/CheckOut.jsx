import React from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shoppingView/Address";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shoppingView/UserCartItemsContent";
import emptyCart from "../../assets/emptyCart.jpg";
import { Button } from "@/components/ui/button";

function CheckOut() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const totalCartIAmount =
    cartItems && cartItems?.items?.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5 ">
        <Address />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemsContent cartItem={item} />
            ))
          ) : (
            <div className="flex justify-center items-center h-[400px] w-full gap-4">
              <img className="h-20" src={emptyCart} />
              <span className="font-bold text-2xl mt-4">
                Your cart is empty
              </span>
            </div>
          )}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartIAmount}</span>
            </div>
          </div>
          <div className="w-full mt-4">
            <Button className="w-full">Checkout with paypal</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
