"use client";

import { selectMainCategory } from "@/features";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./loading";

function HomePage() {
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

  return <Loading />;
}

export default HomePage;
