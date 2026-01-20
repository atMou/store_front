"use client";

import { selectMainCategory } from "@/features";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function ShopLayout({ children }: { children: React.ReactNode }) {
  const mainCategory = useAppSelector(selectMainCategory);
  const router = useRouter();

  useEffect(() => {
    console.log("Main Category from layout:", mainCategory);
    if (mainCategory) {
      router.replace(`/${mainCategory.toLowerCase()}-home`);
    } else {
      router.replace(`/women-home`);
    }
  }, [mainCategory, router]);

  return <>{children}</>;
}

export default ShopLayout;
