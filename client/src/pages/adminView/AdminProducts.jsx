import ImageUpload from "@/components/adminView/ImageUpload";
import FormCommon from "@/components/common/FormCommon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  fetchAllProduct,
} from "../../../store/admin/productSlice";
import { useToast } from "@/hooks/use-toast";
import ProductTile from "../../components/adminView/ProductTile";

const initialState = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  sellPrice: "",
  totalStock: "",
};

function AdminProducts() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialState);
  const [openProducts, setOpenProducts] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { productList } = useSelector((state) => state.adminProducts);
  const [currentEditProductId, setCurrentEditProductId] = useState(null);
  const { toast } = useToast();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(
      addNewProduct({
        ...formData,
        image: uploadImageUrl,
      })
    ).then((data) => {
      if (data.payload?.success) {
        dispatch(fetchAllProduct());
        setOpenProducts(false);
        setImageFile(null);
        setFormData(initialState);
        toast({
          title: "Product added Successfully.",
        });
      }
    });
  }
  useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);
  useEffect(()=>{
    if(openProducts===false){
      setFormData("");
    }
  },[openProducts])

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenProducts(true)}>Add New Product</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <ProductTile setFormData={setFormData} setOpenProducts={setOpenProducts} setCurrentEditProductId={setCurrentEditProductId} key={productItem._id} product={productItem} />
            ))
          : null}
      </div>
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
          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadImageUrl={uploadImageUrl}
            setUploadImageUrl={setUploadImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            currentEditProductId={currentEditProductId}
            isEditable={currentEditProductId!==null}
          />
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
