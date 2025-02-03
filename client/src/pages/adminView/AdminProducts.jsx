import ImageUpload from "@/components/adminView/ImageUpload";
import FormCommon from "@/components/common/FormCommon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import React, { Fragment, useState } from "react";

const initialState = {
  image:null,
  title:'',
  description:'',
  category:'',
  brand:'',
  price:'',
  sellPrice:'',
  totalStock:''
}

function AdminProducts() {

  const [formData,setFormData] =useState(initialState)
  const [openProducts, setOpenProducts] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState("")

  function onSubmit(){

  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenProducts(true)}>Add New Product</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"></div>
      <Sheet
        open={openProducts}
        onOpenChange={() => {
          setOpenProducts(false);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>
          <ImageUpload file={imageFile} setFile={setImageFile} uploadImageUrl={uploadImageUrl} setUploadImageUrl={setUploadImageUrl}/>
          <div className="py-6 ">
            <FormCommon
            formData={formData}
            setFormData={setFormData}
            buttonText="ADD"
            formControl={addProductFormElements}
            onSubmit={onSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
