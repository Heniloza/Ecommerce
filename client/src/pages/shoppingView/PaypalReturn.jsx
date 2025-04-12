import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { capturePayment } from "../../../store/shop/orderSlice";

function PaypalReturn() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (token && payerId) {
      const getCurrentOrderId = JSON.parse(
        sessionStorage.getItem("currentOrderId")
      );
      dispatch(
        capturePayment({
          paymentId: token,
          payerId,
          orderId: getCurrentOrderId,
        })
      )
        .then((data) => {
          console.log("Capture Response:", data);
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            window.location.href = "/shop/paymentSuccess";
          }
        })
        .catch((err) => {
          console.log("error occured", err);
        });
    }
  }, [dispatch, token, payerId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment... please Wait</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturn;
