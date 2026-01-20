"use client";

import { AppRoutes } from "@/constants";
import { useCart } from "@/features/cart/hooks";
import { useAuth } from "@/hooks/state";
import { Button } from "@/shared/ui";
import ShoppingBagIcon from "@/shared/ui/icons/ShoppingBagIcon";

import { useRouter } from "next/navigation";
import CartDropdown from "../../../features/cart/components/CartDropdown";

function CartIcon() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const { cart, itemCount, isLoading } = useCart();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(AppRoutes.LOGIN);
    }
    router.push(AppRoutes.CART);
  };

  return (
    <div className="relative z-100 group">
      <Button
        variant="plain"
        className="
      px-4 text-gray-800 flex items-center 
      border-transparent border-2 border-b-0
      group-hover:border-gray-800
      group-hover:bg-white
      relative z-70
      transition-colors duration-100 rounded-none
    "
        onClick={handleClick}
      >
        <ShoppingBagIcon />

        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {itemCount}
          </span>
        )}
        <span className="sr-only">Shopping Cart</span>
      </Button>
      <CartDropdown cart={cart || null} isLoading={isLoading} />
    </div>
  );
}

export default CartIcon;
