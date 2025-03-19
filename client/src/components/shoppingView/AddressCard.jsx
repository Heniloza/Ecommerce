import React from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({ addressInfo }) {
  return (
    <Card>
      <CardContent className="grid gap-4">
        <Label>{addressInfo?.address}</Label>
        <Label>{addressInfo?.city}</Label>
        <Label>{addressInfo?.pinCode}</Label>
        <Label>{addressInfo?.phone}</Label>
        <Label>{addressInfo?.notes}</Label>
      </CardContent>
    </Card>
  );
}

export default AddressCard;
