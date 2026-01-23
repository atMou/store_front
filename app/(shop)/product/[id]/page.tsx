"use client";

import { Dropdown } from "@/components/atoms";
import Rating from "@/components/feedback/Rating";
import LandingLayout from "@/components/layouts/LandingLayout";
import { SIZES } from "@/constants";
import { SubscribeButton } from "@/features";
import { useCart } from "@/features/cart/hooks";
import { ProductsViewedCarousel } from "@/features/product";
import { useGetProductByIdQuery } from "@/features/product/api";
import ProductReviews from "@/features/product/components/ProductReviews";
import { addViewedProduct } from "@/features/product/slice";
import useToast from "@/hooks/ui/useToast";
import { logger } from "@/shared/lib/logger";
import { FavoriteIconButton } from "@/shared/ui";
import { useAppDispatch } from "@/store/hooks";
import { ChevronDown, Heart, Package, RotateCcw, Truck } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const { data: product, isLoading } = useGetProductByIdQuery({
    id,
    include: "variants,reviews",
  });

  useEffect(() => {
    if (product) {
      dispatch(addViewedProduct(product));
    }
  }, [product, dispatch]);

  const { addItem, updateItem, items, isAdding, isUpdating } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showAllColors, setShowAllColors] = useState(false);

  // Derive selectedVariantId from the selected color
  const selectedColorVariantId =
    product?.colorVariants?.[selectedColor]?.id || null;

  const addToBag = async () => {
    const selectedVariant = product?.colorVariants?.[selectedColor];

    if (!selectedVariant || !size || !selectedColorVariantId) {
      showToast({
        message: "Please select both color and size",
        type: "error",
      });
      return;
    }

    const sizeVariant = selectedVariant.sizeVariants?.find(
      (sv) => sv.size.code === size
    );

    if (!sizeVariant) {
      showToast({
        message: "Selected size is not available",
        type: "error",
      });
      return;
    }

    try {
      const existingItem = items.find(
        (item) =>
          item.productId === product!.id &&
          item.colorVariantId === selectedColorVariantId &&
          item.sizeVariantId === sizeVariant.id
      );

      if (existingItem) {
        // Update quantity of existing item
        const result = await updateItem(
          product!.id,
          existingItem.quantity + 1,
          selectedColorVariantId,
          sizeVariant.id
        );

        if (result.success) {
          showToast({
            message: "Item quantity updated in cart",
            type: "success",
          });
        } else {
          showToast({
            message: result.error?.detail || "Failed to update cart",
            type: "error",
          });
        }
      } else {
        // Add new line item
        const result = await addItem({
          productId: product!.id,
          colorVariantId: selectedColorVariantId,
          sizeVariantId: sizeVariant.id,
          color: selectedVariant.color.name,
          size: sizeVariant.size.code,
          sku: sizeVariant.sku,
          slug: product!.slug,
          imageUrl:
            selectedVariant.images?.find((img) => img.isMain)?.url ||
            selectedVariant.images?.[0]?.url ||
            product!.images?.[0]?.url ||
            "",
          quantity: 1,
          unitPrice: product!.newPrice || product!.price,
          lineTotal: product!.newPrice || product!.price,
        });

        if (result.success) {
          showToast({
            message: "Item added to cart successfully",
            type: "success",
          });
          // Reset selections after successful add
          setSize("");
        } else {
          showToast({
            message: result.error?.detail || "Failed to add item to cart",
            type: "error",
          });
        }
      }
    } catch (error) {
      logger.error("Error adding to bag", error);
      showToast({
        message: "An unexpected error occurred",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <LandingLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse flex flex-col md:flex-row gap-8">
            <div className="flex gap-4 md:w-1/2">
              <div className="flex flex-col gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-16 h-20 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="flex-1 h-[500px] bg-gray-200 rounded" />
            </div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      </LandingLayout>
    );
  }

  if (!product) {
    return (
      <LandingLayout>
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </LandingLayout>
    );
  }

  const variants = product.colorVariants || [];

  // Get all available sizes and their stock status for the selected color
  const selectedVariant = variants[selectedColor];
  const availableSizeCodes = new Set(
    selectedVariant?.sizeVariants
      ?.filter((sv) => sv.stock > 0)
      .map((sv) => sv.size.code) || []
  );

  // Use SIZES constant and mark them as available or not based on selected color
  const allSizes = SIZES.map((sizeCode) => ({
    code: sizeCode,
    isAvailable: availableSizeCodes.has(sizeCode),
  }));

  // Use selected variant images if available, else product images
  const images =
    variants[selectedColor]?.images?.length > 0
      ? variants[selectedColor].images
      : product.images || [];

  const discount = product.newPrice
    ? Math.round(((product.price - product.newPrice) / product.price) * 100)
    : null;

  // Calculate overall stock level based on average of available sizes
  const getOverallStockStatus = () => {
    const availableVariants =
      selectedVariant?.sizeVariants?.filter((sv) => sv.stock > 0) || [];

    if (availableVariants.length === 0)
      return { label: "Out of stock", color: "text-red-600" };

    const stockLevels = {
      LowStock: 1,
      MediumStock: 2,
      HighStock: 3,
    };

    const totalScore = availableVariants.reduce((acc, sv) => {
      // Normalize string to match keys (e.g. "LowStock", "Low Stock", "lowstock")
      const level =
        Object.keys(stockLevels).find(
          (key) =>
            key.toLowerCase() ===
            (sv.stockLevel || "").replace(/\s/g, "").toLowerCase()
        ) || "LowStock";
      return acc + (stockLevels[level as keyof typeof stockLevels] || 1);
    }, 0);

    const averageScore = Math.round(totalScore / availableVariants.length);

    if (averageScore >= 3)
      return { label: "High Stock", color: "text-green-600" };
    if (averageScore >= 2)
      return { label: "Medium Stock", color: "text-orange-600" };
    return { label: "Low Stock", color: "text-red-600" };
  };

  const overallStock = getOverallStockStatus();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <LandingLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Image Gallery */}
          <div className="flex gap-4 md:w-1/2">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 border-2 overflow-hidden ${
                    selectedImage === idx
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || product.brand}
                    width={64}
                    height={80}
                    className="w-full h-full  object-cover"
                    // fill
                    quality={95}
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 max-w-[420px] max-h-[500px] bg-gray-50">
              {images[selectedImage] && (
                <Image
                  src={images[selectedImage].url}
                  alt={images[selectedImage].altText || product.brand}
                  className="w-full h-full  object-center object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  quality={95}
                  loading="lazy"
                  // priority
                />
              )}
              {discount && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Deal
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="md:w-1/2">
            {/* Brand & Title */}
            <a
              href="#"
              className="text-lg font-semibold underline hover:no-underline"
            >
              {product.brand}
            </a>
            <h1 className="text-xl font-bold mt-1 mb-2">
              {product.description?.slice(0, 60)}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-red-600">
                €{product.newPrice ?? product.price}
              </span>
              <span className="text-sm text-gray-500">VAT included</span>
            </div>
            {product.newPrice && (
              <div className="text-sm text-gray-500 mb-4">
                Regular price:{" "}
                <span className="line-through">€{product.price}</span>{" "}
                <span className="text-red-600 font-semibold">-{discount}%</span>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4 text-sm">
              <span className="text-gray-600">Overall availability:</span>
              <span className={`font-medium ${overallStock.color}`}>
                {overallStock.label}
              </span>
            </div>

            {/* Color Selector (as variant thumbnails) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  Colour:{" "}
                  <span className="font-semibold text-gray-900">
                    {variants[selectedColor]?.color?.name || "-"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap mb-4">
                {(showAllColors ? variants : variants.slice(0, 6)).map(
                  (variant, idx) => {
                    const mainImg =
                      variant.images?.find((img) => img.isMain) ||
                      variant.images?.[0];
                    return (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedColor(idx);
                          setSelectedImage(0);
                          setSize(""); // Reset size when changing color
                        }}
                        className={`group relative w-16 h-20  overflow-hidden transition-all duration-200 ${
                          selectedColor === idx
                            ? "ring-2 ring-black "
                            : "ring-1 ring-gray-200 hover:ring-gray-400"
                        }`}
                        title={variant.color?.name}
                      >
                        {mainImg ? (
                          <Image
                            src={mainImg.url}
                            alt={
                              mainImg.altText ||
                              variant.color?.name ||
                              "Variant"
                            }
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-50">
                            No Img
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
                {!showAllColors && variants.length > 6 && (
                  <button
                    className="flex items-center justify-center w-16 h-20 border border-gray-200 rounded-md text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowAllColors(true)}
                    type="button"
                    tabIndex={0}
                  >
                    +{variants.length - 6}
                  </button>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <Dropdown
                onChange={(value) =>
                  setSize(Array.isArray(value) ? value[0] : value)
                }
                label="Size"
                placeholder="Please select a size"
                options={allSizes.map((s) => ({
                  label: s.code,
                  value: s.code,
                  disabled: !s.isAvailable,
                }))}
                value={size}
                renderOption={(option) => {
                  const sizeCode = option.value as string;
                  const sizeVariant = variants[
                    selectedColor
                  ]?.sizeVariants?.find((sv) => sv.size.code === sizeCode);
                  const stock = sizeVariant?.stock || 0;
                  const isLowStock = stock <= 5 && stock > 0;

                  return (
                    <div
                      className={`px-3 py-2 flex items-center justify-between w-full h-full ${
                        option.disabled
                          ? "cursor-not-allowed text-gray-400 bg-gray-50"
                          : "hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>

                      {!option.disabled ? (
                        <div className="flex items-center">
                          {isLowStock ? (
                            <span className="text-orange-600 font-bold text-xs">
                              Only {stock} pcs left
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium text-xs">
                              Available: {stock} pcs
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <SubscribeButton
                            productId={product.id}
                            colorCode={
                              product.colorVariants?.[selectedColor]?.color
                                ?.name || ""
                            }
                            sizeCode={option.value}
                            onSuccess={(message) =>
                              showToast({ message, type: "success" })
                            }
                            onError={(message) =>
                              showToast({ message, type: "error" })
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </div>

            {/* Add to Bag & Favorite */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={addToBag}
                disabled={
                  !size || !selectedColorVariantId || isAdding || isUpdating
                }
                className={`flex-1 py-3 px-6 font-semibold transition-colors ${
                  size && selectedColorVariantId && !isAdding && !isUpdating
                    ? "bg-black text-white cursor-pointer hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {!selectedColorVariantId
                  ? "Please select a color"
                  : !size
                    ? "Please select a size"
                    : "Add to bag"}
              </button>
              <FavoriteIconButton
                productId={product.id}
                className="border-gray-300 border hover:border-black transition-colors"
              />
            </div>

            {/* Popular Item Notice */}
            {product.status.isBestSeller && (
              <div className="flex items-center  gap-2 text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded">
                <Heart size={16} />
                <span>
                  This is one of our most popular and least returned items
                </span>
              </div>
            )}

            {/* Rating */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <Rating rating={product.rating?.value || 0} />
                <span className="text-sm text-gray-600">
                  {product.rating?.value?.toFixed(1) || "0.0"} (
                  {product.totalReviews || 0} reviews)
                </span>
              </div>
              {/* {isLoadingCanWriteReview && (
                <div className="mt-2 text-sm text-gray-500">Checking...</div>
              )}
              {canWriteReview && !isLoadingCanWriteReview && (
                <a
                  href={`#write-review`}
                  className="text-sm underline mt-2 inline-block hover:no-underline"
                >
                  Write a review
                </a>
              )}
              {canWriteReviewError && !isLoadingCanWriteReview && (
                <div className="mt-2 text-sm text-gray-500">
                  Unable to determine review eligibility.
                </div>
              )} */}
            </div>

            {/* Delivery Info */}
            <div className="border border-gray-200 rounded mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="text-sm">
                  Sold by <span className="font-semibold">{product.brand}</span>
                  , shipped by Store.
                </div>
              </div>
              <div className="p-4 border-b border-gray-200 flex items-start gap-3">
                <Truck size={20} className="text-gray-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">
                    Tue 9 Dec – Wed 10 Dec
                  </div>
                  <div className="text-sm text-gray-500">Standard delivery</div>
                </div>
                <span className="ml-auto text-sm font-semibold">free</span>
              </div>
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <Package size={20} className="text-gray-600" />
                <span className="text-sm font-semibold">
                  Free delivery and free returns
                </span>
              </div>
              <div className="p-4 flex items-center gap-3">
                <RotateCcw size={20} className="text-gray-600" />
                <span className="text-sm font-semibold">
                  30 day return policy
                </span>
              </div>
            </div>

            {/* At a Glance */}
            {product.detailsAttributes &&
              product.detailsAttributes.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">At a glance</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {product.detailsAttributes.map((attr, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <div className="font-semibold text-sm">
                            {attr.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {attr.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Accordion Sections */}
            <div className="border-t border-gray-200">
              {["Material & care", "Details", "Size & fit"].map((section) => (
                <div key={section} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection(section)}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold">{section}</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        expandedSections.includes(section) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedSections.includes(section) && (
                    <div className="pb-4 text-sm text-gray-600">
                      {section === "Material & care" && (
                        <p>
                          Material composition and care instructions for this
                          product.
                        </p>
                      )}
                      {section === "Details" && <p>{product.description}</p>}
                      {section === "Size & fit" && (
                        <p>Size and fit information for this product.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Brand Follow */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="font-semibold">{product.brand}</span>
              <button className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:border-black transition-colors">
                + Follow
              </button>
            </div>
          </div>
        </div>
      </div>
      <ProductsViewedCarousel
        currentProductId={product.id}
      ></ProductsViewedCarousel>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductReviews product={product} />
      </div>
    </LandingLayout>
  );
}
