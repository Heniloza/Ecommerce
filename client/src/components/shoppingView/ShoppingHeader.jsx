import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutnUser } from "../../../store/auth-slice/index.js";
import UserCartWrapper from "./UserCartWrapper";
import { fetchCartItems } from "../../../store/shop/cartSlice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("home");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentItem) {
    if (getCurrentItem.id === "products") {
      setActiveItem(getCurrentItem.id);
      sessionStorage.removeItem("filters");
      navigate(getCurrentItem.path);
    } else {
      setActiveItem(getCurrentItem.id);
      sessionStorage.removeItem("filters");
      const currentFilters =
        getCurrentItem.id !== "home" &&
        getCurrentItem.id !== "products" &&
        getCurrentItem.id !== "search"
          ? {
              category: [getCurrentItem.id],
            }
          : null;
      sessionStorage.setItem("filters", JSON.stringify(currentFilters));
      console.log(location);

      location.pathname.includes("listing") && currentFilters !== null
        ? setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`))
        : navigate(getCurrentItem.path);
    }
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItems) => (
        <Label
          key={menuItems.id}
          className={`text-sm font-medium cursor-pointer relative after:content-[''] after:absolute after:w-full after:h-[2px] after:left-0 after:bottom-[-3px] after:origin-left after:transition-transform after:duration-300 ${
            activeItem === menuItems.id
              ? "after:scale-x-100 after:bg-gray-500"
              : "after:scale-x-0 hover:after:scale-x-100 after:bg-gray-400"
          }`}
          onClick={() => handleNavigate(menuItems)}
        >
          {menuItems.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useSelector((state) => state.shopCart);
  function handleLogout() {
    dispatch(logoutnUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems && cartItems.items ? cartItems.items : []}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="w-6 h-6 mr-2" />
            Account
            <DropdownMenuSeparator />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="w-6 h-6 mr-2" /> Logout
            <DropdownMenuSeparator />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/shop/home">
            <HousePlug className="h-6 w-6" />
          </Link>
          <span className="font-bold">TrendHive</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button varient="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
