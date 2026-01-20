"use client";
import {
  selectUserLikedProductIds,
  useToggleLikedProductMutation,
  userActions,
} from "@/features";
import { useAuth } from "@/hooks";
import useToast from "@/hooks/ui/useToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Heart } from "lucide-react";
import { getErrors } from "../lib/httpStatusCodes";

type FavoriteIconButtonProps = {
  className?: string;
  buttonSize?: number | string;
  iconSize?: number;
  productId: string;
};

export default function FavoriteIconButton({
  className = "",
  buttonSize = 48,
  iconSize = 20,
  productId,
}: FavoriteIconButtonProps) {
  const likedProductsIds = useAppSelector(selectUserLikedProductIds);

  const [toggleLikedProduct] = useToggleLikedProductMutation();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const isFavorite = likedProductsIds.includes(productId);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      // Guest user - only update local state
      dispatch(userActions.toggleLikedProductId(productId));
      return;
    }

    // Authenticated user - sync with backend
    const result = await toggleLikedProduct({ productIds: [productId] });

    if (result.error) {
      const errorMessage =
        getErrors(result.error).errors.join(", ") ||
        "An error occurred while updating your favorites. Please try again.";
      showToast({ message: errorMessage, type: "error" });
    }
  };
  const buttonClass =
    typeof buttonSize === "string"
      ? `${buttonSize} flex cursor-pointer items-center justify-center group ${className}`
      : `  flex cursor-pointer items-center justify-center group ${className}`;
  const buttonStyle =
    typeof buttonSize === "number"
      ? { width: buttonSize, height: buttonSize }
      : undefined;

  return (
    <button onClick={handleClick} className={buttonClass} style={buttonStyle}>
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <Heart
          size={iconSize}
          className={`transition-all duration-300 ${
            isFavorite
              ? "fill-red-600 stroke-red-600 animate-[fillUp_0.4s_ease-out]"
              : "fill-none stroke-current"
          }`}
          strokeWidth={1}
        />
      </div>
    </button>
  );
}
