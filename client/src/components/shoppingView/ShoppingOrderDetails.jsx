import React from "react";
import { Label } from "../ui/label";
import { DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";

function ShoppingOrderDetails() {
  return (
    <DialogContent className="sm:max-w-[600px] ">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between mt-6">
            <p className="font-medium">Order ID:</p>
            <Label>123456</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order DATE:</p>
            <Label>21/11/2005</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Price:</p>
            <Label>₹5000</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Status:</p>
            <Label>In Process</Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div>Order Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span>Product One</span>
                <span>Product Price 500</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div>Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>John Doe</span>
              <span>address</span>
              <span>City</span>
              <span>PinCode</span>
              <span>Phone</span>
              <span>Notes</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetails;
