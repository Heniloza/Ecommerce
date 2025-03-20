import React, { useState } from "react";
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
import { Dialog } from "../ui/dialog";
import OrderDetails from "./OrderDetails";

function AdminOrdersComponent() {
  const [opendetailsDialog, setOpenDetailsDialog] = useState(false);
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
            <TableRow>
              <TableCell>12345</TableCell>
              <TableCell>21/11/2005</TableCell>
              <TableCell>In process</TableCell>
              <TableCell>₹5000</TableCell>
              <TableCell>
                <Dialog
                  open={opendetailsDialog}
                  onOpenChange={setOpenDetailsDialog}
                >
                  <Button onClick={() => setOpenDetailsDialog(true)}>
                    View Details
                  </Button>
                  <OrderDetails />
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersComponent;
