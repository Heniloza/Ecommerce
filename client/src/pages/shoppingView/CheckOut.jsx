import React, { useState } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shoppingView/Address";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shoppingView/UserCartItemsContent";
import emptyCart from "../../assets/emptyCart.jpg";
import { Button } from "@/components/ui/button";

function CheckOut() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { userId } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

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

  function handleInitiatePaypalPayment() {
    const orderData = {
      userId: user?.id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: String,
        address: String,
        city: String,
        pinCode: String,
        phone: String,
        notes: String,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartIAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
  }

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
        <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
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
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              Checkout with paypal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
