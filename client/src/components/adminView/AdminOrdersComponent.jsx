import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogTitle } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrderUsers,
  getOrderDetailsAdmin,
  resetOrderDetailsAdmin,
} from "../../../store/admin/orderSlice";
import OrderDetails from "./OrderDetails";
import { Badge } from "../ui/badge";

function AdminOrdersComponent() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getID) {
    dispatch(getOrderDetailsAdmin(getID));
  }

  useEffect(() => {
    dispatch(getAllOrderUsers());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Order History</CardTitle>
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
                          item?.orderStatus === "confirmed" ||
                          item?.orderStatus === "Delivered" ||
                          item?.orderStatus === "inshipping" ||
                          item?.orderStatus === "inprocess"
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
                          dispatch(resetOrderDetailsAdmin());
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
                        <OrderDetails orderDetails={orderDetails} />
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

export default AdminOrdersComponent;
