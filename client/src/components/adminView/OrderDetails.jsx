import React, { useState } from "react";
import { Label } from "../ui/label";
import { DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import FormCommon from "../common/FormCommon";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrderUsers,
  getOrderDetailsAdmin,
  updateOrderStatus,
} from "../../../store/admin/orderSlice";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  status: "",
};

function OrderDetails({ orderDetails }) {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(e) {
    e.preventDefault();
    const { status } = formData;
    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      // console.log(data);
      if (data?.payload.success) {
        dispatch(getOrderDetailsAdmin(orderDetails?._id));
        dispatch(getAllOrderUsers());
        setFormData(initialState);
        toast({
          title: `${data?.payload?.message} to ${status}`,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto ">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between mt-6">
            <p className="font-medium">Order ID:</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order DATE:</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Price:</p>
            <Label>₹{orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Mehtod:</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Status:</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Status:</p>
            <Label>
              <Badge
                className={`py-1 px-3 font-bold ${
                  orderDetails?.orderStatus === "confirmed" ||
                  orderDetails?.orderStatus === "delivered" ||
                  orderDetails?.orderStatus === "inshipping" ||
                  orderDetails?.orderStatus === "inprocess"
                    ? "bg-green-500"
                    : "bg-red-700"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div>Order Details</div>

            <div className="grid grid-cols-3 font-bold">
              <span>Title</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Price</span>
            </div>

            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <li key={index} className="grid grid-cols-3 items-center">
                      <span>{item?.title}</span>
                      <span className="text-center">{item?.quantity}</span>
                      <span className="text-right">₹{item?.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="border">
          <FormCommon
            formControl={[
              {
                label: "Order status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inprocess", label: "In Process" },
                  { id: "inshipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update order status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default OrderDetails;
