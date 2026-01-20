import { logger } from "@/shared/lib/logger";
import { Cart, CartItem } from "../types";

/**
 * Sync guest cart items with backend after user logs in
 * @param guestCart - The guest cart from local state
 * @param syncToBackend - Function to sync items to backend
 * @returns Promise that resolves when sync is complete
 */
export async function syncGuestCartWithBackend(
  guestCart: Cart | null,
  syncToBackend: (items: CartItem[]) => Promise<Cart>
): Promise<Cart | null> {
  if (!guestCart || guestCart.lineItems.length === 0) {
    logger.info("No guest cart items to sync");
    return null;
  }

  try {
    logger.info("Syncing guest cart with backend", {
      itemCount: guestCart.lineItems.length,
    });

    const syncedCart = await syncToBackend(guestCart.lineItems);

    logger.info("Guest cart synced successfully", {
      syncedItemCount: syncedCart.lineItems.length,
    });

    return syncedCart;
  } catch (error) {
    logger.error("Failed to sync guest cart", error as Error, {
      itemCount: guestCart.lineItems.length,
    });
    throw error;
  }
}
