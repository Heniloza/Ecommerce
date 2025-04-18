import React, { useState } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shoppingView/Address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shoppingView/UserCartItemsContent";
import emptyCart from "../../assets/emptyCart.jpg";
import { Button } from "@/components/ui/button";
import { createOrder } from "../../../store/shop/orderSlice";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";

function CheckOut() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalUrl } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

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
    if (cartItems.length === 0) {
      toast({
        title: "Your Cart is Empty.",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Select one address to proceed",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pinCode: currentSelectedAddress?.pinCode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
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
    dispatch(createOrder(orderData))
      .then((data) => {
        if (data?.payload?.success) {
          setIsPaymentStart(true);
        } else {
          setIsPaymentStart(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (approvalUrl && !isPaymentStart) {
    window.location.href = approvalUrl;
  }
  console.log("Selected Address:", currentSelectedAddress);

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex justify-center items-center mt-2 w-[800px]">
        <Label>
          {currentSelectedAddress
            ? "Address is selected"
            : "Select Address first to buy item"}
        </Label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3  p-5 ">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
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
            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full"
              disabled={loading || cartItems?.items?.length <= 0}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </span>
              ) : (
                "Checkout with PayPal"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
