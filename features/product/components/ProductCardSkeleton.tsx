import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardFooter } from "@/shared/ui";

type ProductCardSkeletonProps = {
  size?: "small" | "medium" | "large";
};

function ProductCardSkeleton({ size = "medium" }: ProductCardSkeletonProps) {
  return (
    <Card
      className={cn(
        "rounded-none cursor-pointer w-full border-0 animate-pulse",
        size === "small"
          ? "max-w-[220px]"
          : size === "large"
            ? "max-w-[400px]"
            : "max-w-[320px]"
      )}
    >
      {/* Image Skeleton */}
      <CardContent className="relative overflow-hidden aspect-2/3 w-full p-0">
        <div className="w-full h-full bg-gray-200" />

        {/* Favorite button skeleton */}
        <div className="absolute top-0 right-0 h-[30px] w-[30px] bg-gray-300 rounded" />

        {/* Sizes overlay skeleton */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1">
          <div className="flex gap-1 mb-1">
            <div className="h-3 w-6 bg-gray-200 rounded"></div>
            <div className="h-3 w-6 bg-gray-200 rounded"></div>
            <div className="h-3 w-6 bg-gray-200 rounded"></div>
          </div>
          {/* Variant thumbnails skeleton */}
          <div className="flex gap-1">
            <div className="w-8 h-10 bg-gray-200 border border-gray-300"></div>
            <div className="w-8 h-10 bg-gray-200 border border-gray-300"></div>
            <div className="w-8 h-10 bg-gray-200 border border-gray-300"></div>
          </div>
        </div>
      </CardContent>

      {/* Product Info Skeleton */}
      <CardFooter className="flex flex-col p-0 space-y-1">
        {/* Brand */}
        <div
          className={cn(
            "bg-gray-200 rounded w-1/2",
            size === "small" ? "h-3" : size === "large" ? "h-5" : "h-4"
          )}
        ></div>

        {/* Description */}
        <div
          className={cn(
            "bg-gray-200 rounded w-full",
            size === "small" ? "h-3" : "h-4"
          )}
        ></div>
        <div
          className={cn(
            "bg-gray-200 rounded w-4/5",
            size === "small" ? "h-3" : "h-4"
          )}
        ></div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 w-full pt-1">
          <div
            className={cn(
              "bg-gray-200 rounded",
              size === "small"
                ? "h-4 w-12"
                : size === "large"
                  ? "h-5 w-16"
                  : "h-4 w-14"
            )}
          ></div>
          <div className="h-3 w-10 bg-gray-200 rounded"></div>
          <div className="h-3 w-8 bg-gray-200 rounded"></div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCardSkeleton;
