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

type Props = {
  product: Product;
  isLoading?: boolean;
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
    return product.colorVariants[hoveredVariantIdx].sizeVariants
      .filter((sv) => sv.stock > 0)
      .map((sv) => sv.size) as Size[];
  }
  return Array.isArray(product.sizes) ? (product.sizes as Size[]) : [];
}

function SizesOverlay({ sizes }: { sizes: Size[] }) {
  return sizes.length > 0 ? (
    sizes.map((size) => (
      <span
        key={size.name}
        className="py-1 text-sm font-bold text-gray-700  px-1"
      >
        {size.code}
      </span>
    ))
  ) : (
    <span className="text-sm text-gray-500">No sizes available</span>
  );
}

function ProductCard({ product, isLoading }: Props) {
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
      onClick={handleCardClick}
      className="rounded-none cursor-pointer w-[280px] border-0 group"
    >
      <CardContent className="relative overflow-hidden h-[420px] w-full p-0">
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
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-1 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <div className="flex gap-2 flex-wrap">
            <SizesOverlay sizes={getSizesToShow(product, hoveredVariantIdx)} />
          </div>
          {/* Variant thumbnails */}
          {Array.isArray(product.colorVariants) &&
            product.colorVariants.length > 0 && (
              <div className="flex gap-1 py-1">
                {product.colorVariants.slice(0, 4).map((variant, idx) => {
                  const mainImg =
                    variant.images?.find((img) => img.isMain) ||
                    variant.images?.[0];
                  if (!mainImg) return null;
                  return (
                    <Image
                      key={variant.id}
                      src={mainImg.url}
                      alt={mainImg.altText || variant.color?.name || "Variant"}
                      width={60}
                      height={40}
                      className="w-12 h-12 object-cover  border border-gray-500 hover:border-gray-800 transition"
                      onMouseEnter={() => {
                        setHoveredVariantIdx(idx);
                        setDisplayedImage(mainImg);
                      }}
                      onMouseLeave={() => {
                        setHoveredVariantIdx(null);
                        setDisplayedImage(defaultImage);
                      }}
                    />
                  );
                })}
                {product.colorVariants.length > 4 && (
                  <div className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">
                    +{product.colorVariants.length - 4}
                  </div>
                )}
              </div>
            )}
        </div>
      </CardContent>

      {/* Product Info */}
      <CardFooter className="flex flex-col p-0 space-y-2">
        <CardTitle className=" text-black truncate w-full">{brand}</CardTitle>
        <CardDescription className="text-sm font-normal text-black line-clamp-2 w-full leading-tight">
          {shortdescription}
        </CardDescription>

        <div className="flex items-baseline gap-1.5 w-full pt-1">
          {newPrice ? (
            <>
              <span className="text-base font-bold text-red-600">
                €{newPrice.toFixed(2)}
              </span>
              <span className="text-sm line-through text-gray-500">
                €{price.toFixed(2)}
              </span>
              <span className="text-sm font-normal text-red-600">
                -{discount}%
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-black">
              €{price.toFixed(2)}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
