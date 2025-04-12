import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import ShoppingOrderDetails from "./ShoppingOrderDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrderByUser,
  getOrderDetails,
  resetOrderDetails,
} from "../../../store/shop/orderSlice";
import { Badge } from "../ui/badge";
import { DialogTitle } from "../ui/dialog";

function Orders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getID) {
    dispatch(getOrderDetails(getID));
  }

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  useEffect(() => {
    dispatch(getAllOrderByUser(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID </TableHead>
              <TableHead>Order Date </TableHead>
              <TableHead>Order Status </TableHead>
              <TableHead>Order Price </TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?._id}</TableCell>
                    <TableCell>{item?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 font-bold ${
                          item?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : "bg-red-700"
                        }`}
                      >
                        {item?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{item?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <DialogTitle className="sr-only">
                          View Orders Details
                        </DialogTitle>
                        <Button
                          onClick={() => handleFetchOrderDetails(item?._id)}
                        >
                          View Details
                        </Button>
                        <ShoppingOrderDetails orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Orders;
