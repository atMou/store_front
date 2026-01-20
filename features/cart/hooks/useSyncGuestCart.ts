import { logger } from "@/shared/lib/logger";
import { useAppSelector } from "@/store/hooks";
import { useCallback } from "react";
import { useAddMultipleLineItemsMutation } from "../api";
import { selectCart } from "../slice";

/**
 * Hook to sync guest cart with backend after user logs in
 */
export function useSyncGuestCart() {
  const guestCart = useAppSelector(selectCart);
  const [addMultipleItems] = useAddMultipleLineItemsMutation();

  const syncCart = useCallback(
    async (userCartId: string) => {
      if (!guestCart || guestCart.lineItems.length === 0) {
        logger.info("No guest cart items to sync");
        return { success: true };
      }

      try {
        logger.info("Syncing guest cart with backend", {
          itemCount: guestCart.lineItems.length,
          userCartId,
        });

        const items = guestCart.lineItems.map((item) => ({
          productId: item.productId,
          colorVariantId: item.colorVariantId,
          sizeVariantId: item.sizeVariantId,
          quantity: item.quantity,
        }));

        await addMultipleItems({
          cartId: userCartId,
          items,
        }).unwrap();

        logger.info("Guest cart synced successfully");

        return { success: true };
      } catch (error) {
        logger.error("Failed to sync guest cart", error as Error, {
          itemCount: guestCart.lineItems.length,
        });
        return { success: false, error };
      }
    },
    [guestCart, addMultipleItems]
  );

  return { syncCart };
}
