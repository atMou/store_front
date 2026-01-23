"use client";
import { useLazyGetCartQuery } from "@/features/cart/api";
import { useLazyGetOrdersByUserIdQuery } from "@/features/order/api";
import { useAuth } from "@/hooks/state";
import useToast from "@/hooks/ui/useToast";
import { TryAsync } from "@/shared";
import { logger } from "@/shared/lib/logger";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [triggerGetCart] = useLazyGetCartQuery();
  const [triggerGetOrders] = useLazyGetOrdersByUserIdQuery();
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const initUser = async () => {
      if (isAuthenticated && user?.id) {
        // Load Cart if available
        if (user.cartId) {
          const { data: cart, error } = await TryAsync(
            async () =>
              await triggerGetCart({
                Id: user.cartId!,
                include: ["lineItems", "couponIds"],
              }).unwrap()
          );

          if (error) {
            toast.showToast({
              title: error.detail || "Error",
              message: error.errors?.join(", ") || "Failed to load cart",
              type: "error",
            });
          } else {
            logger.info("Cart loaded successfully", {
              itemCount: cart?.lineItems.length,
            });
          }
        }

        // Load User Orders
        const { error: orderError } = await TryAsync(
          async () => await triggerGetOrders({ userId: user.id }).unwrap()
        );

        if (orderError) {
          logger.error("Failed to load user orders", orderError);
        } else {
          logger.info("User orders loaded successfully");
        }
      }
    };

    initUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.cartId, user?.id]);

  return <>{children}</>;
}
