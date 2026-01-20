"use client";
import { useLazyGetCartQuery } from "@/features/cart/api";
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
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user?.cartId) {
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
    };

    loadCart();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.cartId]);

  return <>{children}</>;
}
