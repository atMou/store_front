"use client";

import {
  useAddProductAlternativesMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
} from "@/features/product/api";
import useToast from "@/hooks/ui/useToast";
import { logger } from "@/shared/lib/logger";
import { Button } from "@/shared/ui";
import { ArrowLeft, Check, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AddAlternativesPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedAlternatives, setSelectedAlternatives] = useState<Set<string>>(
    new Set()
  );

  const { data: mainProduct, isLoading: isLoadingMain } =
    useGetProductByIdQuery({
      id: productId,
      include: "variants",
    });

  const { data: productsData, isLoading: isLoadingProducts } =
    useGetAllProductsQuery(
      {
        category: mainProduct?.category || "",
        sub: mainProduct?.subCategory || "",
        type: mainProduct?.productType?.type || "",
        pageNumber: 1,
        pageSize: 100,
      },
      { skip: !mainProduct }
    );

  const [addAlternatives, { isLoading: isSaving }] =
    useAddProductAlternativesMutation();

  const toggleAlternative = (altProductId: string) => {
    setSelectedAlternatives((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(altProductId)) {
        newSet.delete(altProductId);
      } else {
        newSet.add(altProductId);
      }
      return newSet;
    });
  };

  const handleConfirm = async () => {
    if (selectedAlternatives.size === 0) {
      showToast({
        message: "Please select at least one alternative product",
        type: "error",
      });
      return;
    }

    try {
      await addAlternatives({
        productId,
        alternativeProductIds: Array.from(selectedAlternatives),
      }).unwrap();

      logger.info("Alternatives added successfully", {
        productId,
        count: selectedAlternatives.size,
      });

      showToast({
        message: `${selectedAlternatives.size} alternative(s) added successfully`,
        type: "success",
      });

      router.push("/dashboard/inventory");
    } catch (error) {
      logger.error("Failed to add alternatives", error);
      showToast({
        message: "Failed to add alternatives. Please try again.",
        type: "error",
      });
    }
  };

  if (isLoadingMain) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!mainProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Product not found</p>
        <Button onClick={() => router.push("/dashboard/inventory")}>
          Back to Inventory
        </Button>
      </div>
    );
  }

  const filteredProducts =
    productsData?.items.filter((p) => p.id !== productId) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/inventory")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Inventory
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add Alternatives
            </h1>
            <p className="text-gray-600">
              Main Product:{" "}
              <span className="font-medium">{mainProduct.slug}</span>
            </p>
            <p className="text-sm text-gray-500">
              Category: {mainProduct.category} → {mainProduct.subCategory} (
              {mainProduct.productType?.type})
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/dashboard/inventory")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedAlternatives.size === 0 || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Confirm ({selectedAlternatives.size})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {}
      {isLoadingProducts ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">
            No matching products found in this category
          </p>
          <Button onClick={() => router.push("/dashboard/inventory")}>
            Back to Inventory
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isSelected = selectedAlternatives.has(product.id);
            const mainImage =
              product.colorVariants?.[0]?.images?.[0]?.url ||
              "/placeholder.png";

            return (
              <div
                key={product.id}
                className={`border rounded-lg overflow-hidden transition-all ${
                  isSelected
                    ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src={mainImage}
                    alt={product.slug}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {product.slug}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  <p className="text-lg font-bold text-gray-900 mb-3">
                    ${product.price.toFixed(2)}
                  </p>

                  <Button
                    variant={isSelected ? "secondary" : "default"}
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => toggleAlternative(product.id)}
                  >
                    {isSelected ? (
                      <>
                        <Check size={16} />
                        Selected
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add Alternative
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
