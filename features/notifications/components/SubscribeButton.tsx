import { useNotifications } from "@/features/notifications";
import {
  selectIsSubscribedToProduct,
  selectUser,
  userActions,
} from "@/features/user";
import { logger } from "@/shared/lib/logger";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
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
    console.log("SubscribeButton clicked");

    // Ensure clean inputs for group names
    const cleanColor = colorCode.trim();
    const cleanSize = sizeCode.trim();

    if (!user) {
      onError?.("Please login to subscribe to stock alerts");
      return;
    }

    const clickTime = Date.now();
    logger.info("🔔 [TIMING 1/6] Subscribe button clicked", {
      productId,
      colorCode: cleanColor,
      sizeCode: cleanSize,
      isSubscribed,
      timestamp: new Date().toISOString(),
    });

    const wasSubscribed = isSubscribed;

    dispatch(
      userActions.toggleProductSubscription({
        productId,
        color: cleanColor,
        size: cleanSize,
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
        await unsubscribeFromProduct(productId, cleanColor, cleanSize);
      } else {
        await subscribeToProduct(productId, cleanColor, cleanSize);
      }

      const afterToggle = Date.now();
      logger.info(
        "🔔 [TIMING 6/6] Toggle completed - total elapsed: " +
          (afterToggle - clickTime) +
          "ms"
      );

      logger.info("Toggle completed", {
        productId,
        colorCode: cleanColor,
        sizeCode: cleanSize,
        wasSubscribed,
        nowSubscribed: !wasSubscribed,
      });

      const message = wasSubscribed
        ? `Unsubscribed from ${cleanColor} size ${cleanSize} notifications`
        : `You'll be notified when ${cleanColor} size ${cleanSize} is back in stock`;

      logger.debug("Calling onSuccess with message", { message });
      onSuccess?.(message);
    } catch (error) {
      // Rollback on error
      dispatch(
        userActions.toggleProductSubscription({
          productId,
          color: cleanColor,
          size: cleanSize,
        })
      );

      logger.error("Subscription toggle error", error as Error, {
        productId,
        colorCode: cleanColor,
        sizeCode: cleanSize,
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

  const tooltipText = !user
    ? "Login to subscribe"
    : isSubscribed
      ? "Unsubscribe from notifications"
      : "Notify me when available";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          className={`transition-colors cursor-pointer ${
            isSubscribed
              ? "text-black hover:text-gray-600"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {isSubscribed ? (
            <span className="flex gap-1 items-center text-xs font-medium text-gray-500">
              Unsubscribe <BellOff size={16} />
            </span>
          ) : (
            <span className="flex gap-1 items-center text-xs font-medium text-gray-500">
              Notify me <Bell size={16} />
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SubscribeButton;
