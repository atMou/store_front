"use client";

import { useInfiniteLikedProducts } from "@/features/product";
import {
  selectUserLikedProductIds,
  useToggleLikedProductMutation,
} from "@/features/user";
import useToast from "@/hooks/ui/useToast";
import { getErrors } from "@/shared";
import { Button } from "@/shared/ui";
import { useAppSelector } from "@/store";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import LikedProductsDropdown from "../../../features/product/components/LikedProductsDropdown";

function LikedProductsIcon() {
  const likedProductIds = useAppSelector(selectUserLikedProductIds);
  const { products, isLoading } = useInfiniteLikedProducts({
    productIds: likedProductIds,
    include: "variants",
  });

  const router = useRouter();
  const { showToast } = useToast();
  const [toggleLikedProduct] = useToggleLikedProductMutation();

  const hasPadding = useMemo(
    () => likedProductIds.length > 9,
    [likedProductIds.length]
  );

  const handleRemove = async (productId: string) => {
    const result = await toggleLikedProduct({ productIds: [productId] });
    if (result.error) {
      const errorMessage =
        getErrors(result.error).errors.join(", ") ||
        "An error occurred while updating your favorites. Please try again.";
      showToast({ message: errorMessage, type: "error" });
    }
  };

  const handleMoveToCart = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="relative inline-block z-100 group">
      <Button
        variant="plain"
        className="
           text-gray-800 flex items-center 
          border-transparent border-2 border-b-0
          group-hover:border-gray-800
          group-hover:bg-white
          relative z-70
          transition-colors duration-100 rounded-none px-3! 
        "
      >
        <div className="cursor-pointer relative">
          {likedProductIds.length > 0 && products.length > 0 && (
            <span
              className={`absolute -top-2 -right-3  flex justify-center items-center  min-w-4 h-4   text-xs  text-white  bg-black rounded-full ${hasPadding ? "px-1" : ""}`}
            >
              {likedProductIds.length > 99 ? "+99" : likedProductIds.length}
            </span>
          )}
          <HeartIcon strokeWidth={1} size={20} />
        </div>
      </Button>

      <LikedProductsDropdown
        likedProducts={products}
        isLoading={isLoading}
        onRemove={handleRemove}
        onMoveToCart={handleMoveToCart}
      />
    </div>
  );
}

export default LikedProductsIcon;
