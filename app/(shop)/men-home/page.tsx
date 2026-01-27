"use client";
import LandingLayout from "@/components/layouts/LandingLayout";
import { ProductCarousel } from "@/components/layouts/section";
// import { ProductCarousel } from "@/features/product/components";
export default function MenHome() {
  return (
    <>
      <LandingLayout>
        <ProductCarousel
          filters={{  include: "colorVariants", category: "Men" }}
        ></ProductCarousel>
      </LandingLayout>
    </>
  );
}
