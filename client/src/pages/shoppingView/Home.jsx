import React, { useEffect, useState } from "react";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import { Button } from "../../components/ui/button";
import {
  BabyIcon,
  Box,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Layers,
  ShirtIcon,
  UmbrellaIcon,
  ShoppingBag,
  Star,
  WatchIcon,
  Diamond,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "../../../store/shop/productSlice";
import ShoppingProductTile from "@/components/shoppingView/ShoppingProductTile";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "../../../store/shop/cartSlice";
import ProductDetailsDialogue from "@/components/shoppingView/ProductDetailsDialogue";
import { getFeatureImages } from "../../../store/common/featureSlice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandWithIcon = [
  { id: "nike", label: "Nike", icon: Star },
  { id: "adidas", label: "Adidas", icon: Diamond },
  { id: "puma", label: "Puma", icon: Tag },
  { id: "levi", label: "Levi's", icon: Layers },
  { id: "zara", label: "Zara", icon: ShoppingBag },
  { id: "h&m", label: "H&M", icon: Box },
];

function Home() {
  const slides = [bannerOne, bannerTwo, bannerThree];
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilters = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    navigate("/shop/listing");
  }

  function handleProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId) {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: "",
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch, featureImageList]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                key={index}
                src={slide.image}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                alt={`Slide ${index + 1}`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            );
          }}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 "
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 "
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((item) => (
              <Card
                onClick={() => handleNavigateToListingPage(item, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <item.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandWithIcon.map((item) => (
              <Card
                onClick={() => handleNavigateToListingPage(item, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <item.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleProductDetails={handleProductDetails}
                    product={productItem}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialogue
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default Home;
