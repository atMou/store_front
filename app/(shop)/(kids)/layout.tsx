"use client";

import MainLayout from "@/components/layouts/MainLayout";

export default function KidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout mainCategory="Kids" mainCategoryLink="/kids-home">
      {children}
    </MainLayout>
  );
}
