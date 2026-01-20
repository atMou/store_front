"use client";
import CustomLoader from "@/components/feedback/CustomLoader";
import Rating from "@/components/feedback/Rating";
import { useGetProductByIdQuery } from "@/features/product/api";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Package,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const ManageProduct = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(
    { id: productId, include: "variants,reviews" },
    {
      skip: !productId,
    }
  );

  console.log("Product data:", product);

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError || error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <XCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t retrieve the product information. Please try again
            later.
          </p>
          <button
            onClick={() => router.push("/dashboard/products")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">The product could not be found.</p>
          <button
            onClick={() => router.push("/dashboard/products")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <button
            onClick={() => router.push("/dashboard/products")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Products</span>
          </button>
        </motion.div>

        {/* Product Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100"
        >
          <div className="flex items-start gap-4">
            {product.images && product.images[0] && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={product.images[0].url}
                  alt={product.slug}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <Package className="text-indigo-600" size={20} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {product.slug}
                </h1>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {product.brand}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {product.category}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {product.subCategory}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.newPrice && (
                    <>
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        ${product.newPrice.toFixed(2)}
                      </span>
                      <span className="ml-2 text-sm text-green-600 font-medium">
                        {Math.round(
                          ((product.price - product.newPrice) / product.price) *
                            100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Product Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Product ID
                </label>
                <p className="text-sm text-gray-900">{product.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Description
                </label>
                <p className="text-sm text-gray-900">{product.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Product Type
                </label>
                <p className="text-sm text-gray-900">
                  {product.productType.type} - {product.productType.subType}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Sales & Reviews
                </label>
                <div className="flex gap-4 text-sm items-center">
                  <span className="text-gray-900">
                    <ShoppingBag size={14} className="inline mr-1" />
                    {product.totalSales} sales
                  </span>
                  <div className="flex items-center gap-2">
                    <Rating rating={product.rating.value} />
                    <span className="text-gray-900">
                      ({product.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Variants */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Color Variants
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {product.colorVariants?.map((variant) => (
                  <div
                    key={variant.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: variant.color?.hex || "#ccc",
                        }}
                      />
                      <span className="font-medium">{variant.color?.name}</span>
                      {variant.sku && (
                        <span className="text-xs text-gray-500 ml-auto">
                          SKU: {variant.sku}
                        </span>
                      )}
                    </div>
                    {variant.sizeVariants &&
                      variant.sizeVariants.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">
                            Available Sizes:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {variant.sizeVariants.map((sizeVar) => (
                              <span
                                key={sizeVar.id}
                                className="px-2 py-1 bg-gray-100 rounded text-xs"
                              >
                                {sizeVar.size.name}: {sizeVar.stock} in stock
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Product Status
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.status.isNew && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                New
              </span>
            )}
            {product.status.isFeatured && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
            {product.status.isTrending && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                Trending
              </span>
            )}
            {product.status.isBestSeller && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Best Seller
              </span>
            )}
          </div>
        </motion.div>

        {/* Product Images Gallery */}
        {product.images && product.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Product Images ({product.images.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                >
                  <Image
                    src={img.url}
                    alt={img.altText || product.slug}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {img.isMain && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Details Attributes */}
        {product.detailsAttributes && product.detailsAttributes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Product Details
            </h2>
            <div className="space-y-3">
              {product.detailsAttributes.map((attr, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    {attr.name}
                  </h3>
                  <p className="text-sm text-gray-600">{attr.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Size & Fit Attributes */}
        {product.sizeFitAttributes && product.sizeFitAttributes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Size & Fit
            </h2>
            <div className="space-y-3">
              {product.sizeFitAttributes.map((attr, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    {attr.name}
                  </h3>
                  <p className="text-sm text-gray-600">{attr.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Material Details */}
        {product.materialDetails && product.materialDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Material & Care
            </h2>
            <div className="space-y-2">
              {product.materialDetails.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">
                    {material.detail}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {material.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Available Colors & Sizes Summary */}
        {(product.colors || product.sizes) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Available Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg"
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm text-gray-900">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                      >
                        {size.name} ({size.code})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Alternatives */}
        {product.alternatives && product.alternatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Alternative Products ({product.alternatives.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.alternatives.map((alt) => (
                <div
                  key={alt.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/products/${alt.id}`)}
                >
                  {alt.images && alt.images[0] && (
                    <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={alt.images[0].url}
                        alt={alt.slug}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {alt.slug}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{alt.brand}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${alt.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.45 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Customer Reviews ({product.reviews.length})
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {review.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Rating rating={review.rating} />
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ManageProduct;
