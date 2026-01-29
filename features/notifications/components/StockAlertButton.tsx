"use client";

import { useNotificationContext } from "@/features/notifications";
import { useState } from "react";

export default function StockAlertButton({
  productId,
  productName,
  inStock = false,
}: {
  productId: string;
  productName: string;
  inStock?: boolean;
}) {
  const { subscribeToProduct, unsubscribeFromProduct, isConnected } =
    useNotificationContext();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleToggleAlert = async () => {
    if (isSubscribed) {
      await unsubscribeFromProduct(productId, "", "");
      setIsSubscribed(false);
      alert("You will no longer receive stock alerts for this product");
    } else {
      await subscribeToProduct(productId, "", "");
      setIsSubscribed(true);
      alert(`You'll be notified when ${productName} is back in stock!`);
    }
  };

  if (inStock) {
    return null;
  }

  return (
    <button
      onClick={handleToggleAlert}
      disabled={!isConnected}
      className={`px-6 py-3 border-2 rounded-none font-medium transition-colors ${
        isSubscribed
          ? "border-green-600 text-green-600 hover:bg-green-50"
          : "border-black text-black hover:bg-black hover:text-white"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isConnected ? (
        isSubscribed ? (
          <>✓ Alert Set</>
        ) : (
          <>🔔 Notify Me When Available</>
        )
      ) : (
        "Connecting..."
      )}
    </button>
  );
}
