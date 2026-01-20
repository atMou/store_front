"use client";

import MainLayout from "@/components/layouts/MainLayout";

export default function MenLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout mainCategory="Men" mainCategoryLink="/men-home">
      {children}
    </MainLayout>
  );
}
