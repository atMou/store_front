"use client";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  FavoriteIconButton,
} from "@/shared/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Product, Size } from "../types";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ProductImage from "./ProductImage";

import { cn } from "@/shared/lib/utils";
type Props = {
  product: Product;
  isLoading?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
  hasBackground?: boolean;
};

function getSizesToShow(
  product: Product,
  hoveredVariantIdx: number | null
): Size[] {
  if (
    hoveredVariantIdx !== null &&
    Array.isArray(product.colorVariants) &&
    product.colorVariants[hoveredVariantIdx] &&
    Array.isArray(product.colorVariants[hoveredVariantIdx].sizeVariants)
  ) {
    const sizes = product.colorVariants[hoveredVariantIdx].sizeVariants
      .filter((sv) => sv.stock > 0)
      .map((sv) => sv.size) as Size[];

    // Remove duplicates based on size code
    const uniqueSizes = sizes.filter(
      (size, index, self) =>
        index === self.findIndex((s) => s.code === size.code)
    );
    return uniqueSizes;
  }

  const sizes = Array.isArray(product.sizes) ? (product.sizes as Size[]) : [];
  return sizes.filter(
    (size, index, self) => index === self.findIndex((s) => s.code === size.code)
  );
}

function SizesOverlay({ sizes }: { sizes: Size[] }) {
  if (sizes.length === 0) {
    return <span className=" text-gray-500">No sizes</span>;
  }

  const visibleSizes = sizes.slice(0, 5);
  const remainingCount = sizes.length - 5;

  return (
    <>
      {visibleSizes.map((size) => (
        <span key={size.name} className=" font-bold text-gray-700 px-0.5">
          {size.code}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="font-bold text-gray-700 px-0.5">
          +{remainingCount}
        </span>
      )}
    </>
  );
}

function ProductCard({
  product,
  isLoading,
  className,
  size = "medium",
  hasBackground = false,
}: Props) {
  const router = useRouter();
  const [hoveredVariantIdx, setHoveredVariantIdx] = useState<number | null>(
    null
  );

  const { price, newPrice, images, brand } = product;

  const defaultImage = images?.find((img) => img.isMain) || images?.[0];
  const [displayedImage, setDisplayedImage] = useState(defaultImage);

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const discount = newPrice
    ? Math.round(((price - newPrice) / price) * 100)
    : null;

  const shortdescription =
    product.description.length > 60
      ? product.description.slice(0, 57) + "..."
      : product.description;

  if (isLoading) {
    return <ProductCardSkeleton />;
  }
  return (
    <Card
      dir="ltr"
      onClick={handleCardClick}
      className={cn(
        "rounded-none cursor-pointer w-full border-0 group",
        size === "small"
          ? "max-w-[220px]"
          : size === "large"
            ? "max-w-[400px]"
            : "max-w-[320px]",
        className
      )}
    >
      <CardContent className="relative overflow-hidden  aspect-2/3 w-full p-0">
        <ProductImage
          key={displayedImage?.url || displayedImage?.id}
          url={displayedImage?.url || ""}
          altText={displayedImage?.altText || ""}
          id={displayedImage?.id || ""}
          brand={brand}
        />

        {discount && (
          <Badge
            variant="destructive"
            className="absolute top-0 left-0 text-sm font-bold px-2 py-0.5 rounded-none bg-red-600 text-white border-0"
          >
            Deal
          </Badge>
        )}

        <FavoriteIconButton
          productId={product.id}
          className="bg-white absolute top-0 right-0"
          buttonSize={30}
          iconSize={18}
        />
        {/* Sizes hover overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 
        py-1 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"
        >
          <div className="flex gap-1 flex-wrap mb-1">
            <SizesOverlay sizes={getSizesToShow(product, hoveredVariantIdx)} />
          </div>
          {/* Variant thumbnails */}
          {Array.isArray(product.colorVariants) &&
            product.colorVariants.length > 0 && (
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {product.colorVariants.slice(0, 3).map((variant, idx) => {
                  const mainImg =
                    variant.images?.find((img) => img.isMain) ||
                    variant.images?.[0];
                  if (!mainImg) return null;
                  return (
                    <div
                      key={variant.id}
                      className="relative w-15 h-20 shrink-0 cursor-pointer border border-gray-300 hover:border-black transition-colors"
                      onMouseEnter={() => {
                        setHoveredVariantIdx(idx);
                        setDisplayedImage(mainImg);
                      }}
                      onMouseLeave={() => {
                        setHoveredVariantIdx(null);
                        setDisplayedImage(defaultImage);
                      }}
                    >
                      <Image
                        src={mainImg.url}
                        alt={
                          mainImg.altText || variant.color?.name || "Variant"
                        }
                        fill
                        sizes="60px"
                        className="object-center  object-cover"
                      />
                    </div>
                  );
                })}
                {product.colorVariants.length > 3 && (
                  <div className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-gray-100 text-xs font-semibold text-gray-700 align-center">
                    +{product.colorVariants.length - 3}
                  </div>
                )}
              </div>
            )}
        </div>
      </CardContent>

      {/* Product Info */}
      <CardFooter className={cn("flex flex-col p-3 ", hasBackground ? "bg-white" : "")}>
        <CardTitle
          className={cn(
            "text-black truncate w-full",
            size === "small"
              ? "text-xs"
              : size === "large"
                ? "text-lg"
                : "text-sm"
          )}
        >
          {brand}
        </CardTitle>
        <CardDescription
          className={cn(
            "font-normal text-black line-clamp-2 w-full leading-tight",
            size === "small" ? "text-xs" : "text-sm"
          )}
        >
          {shortdescription}
        </CardDescription>

        <div className="flex items-baseline gap-1.5 w-full pt-1">
          {newPrice ? (
            <>
              <span
                className={cn(
                  "font-bold text-red-600",
                  size === "small"
                    ? "text-sm"
                    : size === "large"
                      ? "text-lg"
                      : "text-base"
                )}
              >
                €{newPrice.toFixed(2)}
              </span>
              <span className="text-xs line-through text-gray-500">
                €{price.toFixed(2)}
              </span>
              <span className="text-xs font-normal text-red-600">
                -{discount}%
              </span>
            </>
          ) : (
            <span
              className={cn(
                "font-bold text-black",
                size === "small"
                  ? "text-sm"
                  : size === "large"
                    ? "text-lg"
                    : "text-base"
              )}
            >
              €{price.toFixed(2)}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
