"use client";

import TextAreaInput from "@/components/atoms/TextAreaInput";
import Rating from "@/components/feedback/Rating";
import { selectMyOrders } from "@/features/order";
import { Product, Review } from "@/features/product";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from "@/features/product/api";
import {
  ReviewFormValues,
  reviewSchema,
} from "@/features/product/validations/ReviewValidation";
import { useAuth } from "@/hooks";
import { logger } from "@/shared/lib/logger";
import { generatePlaceholderImage } from "@/shared/lib/placeholderImage";
import { cn, formatRelativeTime } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useAppSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, MessageSquare, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ProductReviewsProps {
  product: Product;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const { reviews = [], id: productId } = product;
  const { user } = useAuth();
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const orders = useAppSelector(selectMyOrders);

  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const canWriteReview = orders.some((order) =>
    order.orderItems.some((item) => item.productId === productId)
  );

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      await createReview({
        productId,
        rating: values.rating,
        comment: values.comment,
      }).unwrap();
      reset();
      setValue("rating", 5);
    } catch (error) {
      logger.error("Failed to submit review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview({ productId, reviewId }).unwrap();
      } catch (error) {
        logger.error("Failed to delete review:", error);
      }
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <div className="shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Star className="text-yellow-500 fill-yellow-500" size={24} />
        Customer Reviews ({reviews.length})
      </h2>

      {}
      {reviews.length > 0 && (
        <div className=" p-6 mb-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
          <div className="text-center min-w-[120px]">
            <div className="text-4xl font-bold text-gray-900">
              {product.rating.value.toFixed(1)}
            </div>
            <div className="flex justify-center mt-2 mb-1">
              <Rating rating={parseFloat(product.rating.value.toFixed(1))} />
            </div>
            <p className="text-gray-500 text-sm">
              Based on {reviews.length} reviews
            </p>
          </div>
        </div>
      )}

      {}
      {user && canWriteReview && (
        <div className="mb-10 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Write a Review
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setValue("rating", star, { shouldValidate: true })
                    }
                    disabled={
                      isSubmitting ||
                      errors.rating !== undefined ||
                      errors.comment !== undefined
                    }
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={cn(
                        "transition-colors",
                        star <= getValues("rating")
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-transparent text-gray-300 hover:text-yellow-200"
                      )}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <TextAreaInput
              control={control}
              name="comment"
              label="Your Review"
              placeholder="Tell others what you think about this product..."
              required
              rows={4}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12  border border-dashed border-gray-200">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Be the first to create one!
            </p>
          </div>
        ) : (
          reviews.map((review: Review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div className="h-10 w-10 relative rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm ring-2 ring-white overflow-hidden shrink-0">
                    <Image
                      src={
                        review.avatarUrl ||
                        generatePlaceholderImage(review.userName || "User")
                      }
                      alt={review.userName || "User Avatar"}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {review.userName || "Anonymous User"}
                      </span>
                      <span className="text-gray-300 text-xs">•</span>
                      <span className="text-gray-500 text-xs flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>
                    <div className="flex mt-1">
                      <Rating rating={review.rating} />
                    </div>
                  </div>
                </div>

                {(user?.roles.some((role) => role.name === "ADMIN") ||
                  user?.id === review.userId) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                    disabled={isDeleting}
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">Delete review</span>
                  </Button>
                )}
              </div>

              <div className="pl-[52px]">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {expandedReviews[review.id] || review.comment.length <= 250
                    ? review.comment
                    : `${review.comment.slice(0, 250)}...`}
                </p>
                {review.comment.length > 250 && (
                  <button
                    onClick={() => toggleReviewExpansion(review.id)}
                    className="mt-2 text-black hover:text-gray-700 text-xs font-medium hover:underline focus:outline-none"
                  >
                    {expandedReviews[review.id] ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
