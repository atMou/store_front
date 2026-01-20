import { useNotifications } from "@/features/notifications";
import {
  selectIsSubscribedToProduct,
  selectUser,
  userActions,
} from "@/features/user";
import { logger } from "@/shared/lib/logger";
import { useAppDispatch, useAppSelector } from "@/store";
import { Bell, BellOff } from "lucide-react";

interface SubscribeButtonProps {
  productId: string;
  colorCode: string;
  sizeCode: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const SubscribeButton = ({
  productId,
  colorCode,
  sizeCode,
  onSuccess,
  onError,
}: SubscribeButtonProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isSubscribed = useAppSelector((state) =>
    selectIsSubscribedToProduct(state, productId, colorCode, sizeCode)
  );
  const { subscribeToProduct, unsubscribeFromProduct } = useNotifications();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      onError?.("Please login to subscribe to stock alerts");
      return;
    }

    const clickTime = Date.now();
    logger.info("🔔 [TIMING 1/6] Subscribe button clicked", {
      productId,
      colorCode,
      sizeCode,
      isSubscribed,
      timestamp: new Date().toISOString(),
    });

    const wasSubscribed = isSubscribed;

    // Optimistic update
    dispatch(
      userActions.toggleProductSubscription({
        productId,
        color: colorCode,
        size: sizeCode,
      })
    );

    try {
      const beforeToggle = Date.now();
      logger.info(
        "🔔 [TIMING 2/6] Calling SignalR method - elapsed: " +
          (beforeToggle - clickTime) +
          "ms"
      );

      if (wasSubscribed) {
        await unsubscribeFromProduct(productId, colorCode, sizeCode);
      } else {
        await subscribeToProduct(productId, colorCode, sizeCode);
      }

      const afterToggle = Date.now();
      logger.info(
        "🔔 [TIMING 6/6] Toggle completed - total elapsed: " +
          (afterToggle - clickTime) +
          "ms"
      );

      logger.info("Toggle completed", {
        productId,
        colorCode,
        sizeCode,
        wasSubscribed,
        nowSubscribed: !wasSubscribed,
      });

      const message = wasSubscribed
        ? `Unsubscribed from ${colorCode} size ${sizeCode} notifications`
        : `You'll be notified when ${colorCode} size ${sizeCode} is back in stock`;

      logger.debug("Calling onSuccess with message", { message });
      onSuccess?.(message);
    } catch (error) {
      // Rollback on error
      dispatch(
        userActions.toggleProductSubscription({
          productId,
          color: colorCode,
          size: sizeCode,
        })
      );

      logger.error("Subscription toggle error", error as Error, {
        productId,
        colorCode,
        sizeCode,
        wasSubscribed,
      });

      const message =
        error instanceof Error
          ? error.message
          : wasSubscribed
            ? "Failed to unsubscribe from notifications"
            : "Failed to subscribe to notifications";

      logger.debug("Calling onError with message", { message });
      onError?.(message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!user}
      className={`transition-colors ${
        isSubscribed
          ? "text-black hover:text-gray-600"
          : "text-gray-500 hover:text-black"
      }`}
      title={
        !user
          ? "Login to subscribe"
          : isSubscribed
            ? "Unsubscribe from notifications"
            : "Notify me when available"
      }
    >
      {isSubscribed ? <BellOff size={16} /> : <Bell size={16} />}
    </button>
  );
};

export default SubscribeButton;
