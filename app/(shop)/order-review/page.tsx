"use client";

import { withAuth } from "@/components/HOC";
import { LandingPageLayout } from "@/components/layouts";
import { OrderReview } from "@/features/order/components";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const OrderReviewPage = () => {
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  return (
    <LandingPageLayout>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        }
      ></Suspense>
      <OrderReview cartId={cartId} />
    </LandingPageLayout>
  );
};

export default withAuth(OrderReviewPage);
