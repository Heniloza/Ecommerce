import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "../../../store/shop/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "../../../store/shop/productSlice";
import { Label } from "../ui/label";
import StarRating from "../common/StarRating";
import {
  addProductReview,
  getProductReview,
} from "../../../store/shop/reviewSlice";

function ProductDetailsDialogue({ open, setOpen, productDetails }) {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [reviewMessage, setReviewMessage] = useState("");
  const [rating, setRating] = useState(0);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddReview() {
    dispatch(
      addProductReview({
        productId: productDetails?._id,
        userId: user?.id,
        username: user?.username,
        reviewMessage,
        reviewValue: rating,
      })
    ).then((data) => {
      // console.log(data);
      if (data?.payload?.success) {
        dispatch(getProductReview(productDetails?._id));
        toast({
          title: "Review added successfully.",
        });
      }
    });
  }

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
      setRating(0);
      setReviewMessage("");
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to Cart",
        });
      }
    });
  }

  function handleDialogueClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMessage("");
  }

  useEffect(() => {
    if (productDetails !== null)
      dispatch(getProductReview(productDetails?._id));
  }, [productDetails]);
  console.log(reviews, "Got reviews");

  const averageReview =
    reviews.length && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogueClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ₹{productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ₹{productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRating rating={averageReview} />
            </div>
            <span className="text-muted-foreground">{`(${averageReview})`}</span>
          </div>
          <div className="mt-12 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
                className="w-full opacity-60 cursor-not-allowed"
              >
                Out of stock
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
                className="w-full "
              >
                Add To Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((item) => (
                  <div className="flex gap-4 ">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {item?.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{item?.username}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRating rating={item?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {item?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h3>No reviews available</h3>
              )}
            </div>
            <div className="mt-10 flex flex-col gap-2 ">
              <Label>Write a review</Label>
              <div className="flex gap-2">
                <StarRating
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMessage"
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                placeholder="write yout review.."
              />
              <Button
                disabled={reviewMessage.trim() === ""}
                onClick={handleAddReview}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialogue;
