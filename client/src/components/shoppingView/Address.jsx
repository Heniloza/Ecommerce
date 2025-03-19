import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormCommon from "../common/FormCommon";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  fetchAllAddress,
} from "../../../store/shop/addressSlice/index.js";
import AddressCard from "./AddressCard";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pinCode: "",
  notes: "",
};

function Address() {
  const [formData, setFormData] = useState(initialAddressFormData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(e) {
    e.preventDefault();

    dispatch(
      addNewAddress({
        userId: user?.id,
        ...formData,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress(user?.id));
        setFormData(initialAddressFormData);
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb- p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((addressItem) => (
              <AddressCard addressInfo={addressItem} />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>Add new address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormCommon
          formControl={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={"Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
