"use client";

import { AppRoutes } from "@/constants";
import { useCart } from "@/features/cart/hooks";
import { useAuth } from "@/hooks/state";
import ShoppingBagIcon from "@/shared/ui/icons/ShoppingBagIcon";

import { useRouter } from "next/navigation";
import CartDropdown from "../../../features/cart/components/CartDropdown";
import HeaderIcon from "./HeaderIcon";

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
    <HeaderIcon
      icon={<ShoppingBagIcon />}
      badgeCount={itemCount}
      label="Shopping Cart"
      onClick={handleClick}
    >
      <CartDropdown cart={cart || null} isLoading={isLoading} />
    </HeaderIcon>
  );
}

export default CartIcon;
