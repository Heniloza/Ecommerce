import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getSeearchProducts,
  resetSearchresult,
} from "../../../store/shop/searchSlice";
import ShoppingProductTile from "@/components/shoppingView/ShoppingProductTile";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "../../../store/shop/cartSlice";
import ProductDetailsDialogue from "@/components/shoppingView/ProductDetailsDialogue";
import { fetchProductDetails } from "../../../store/shop/productSlice";

function Search() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.shopProducts);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this product`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to Cart",
        });
      }
    });
  }

  function handleProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 1) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSeearchProducts(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchresult());
    }
  }, [keyword]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8 ">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6"
            placeholder="Search Products"
          />
        </div>
      </div>
      <div>
        <p>
          {searchResults === ""
            ? null
            : `${searchResults.length} Product Founded`}
        </p>
      </div>
      {searchResults && searchResults.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((result) => (
            <ShoppingProductTile
              handleAddToCart={handleAddToCart}
              key={result.id}
              product={result}
              handleProductDetails={handleProductDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-[50vh]">
          <h1 className="text-4xl font-extrabold">
            {searchResults === "" ? "Search Something" : "No Product Found"}
          </h1>
        </div>
      )}
      <ProductDetailsDialogue
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default Search;
