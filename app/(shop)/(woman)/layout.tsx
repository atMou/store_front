"use client";

import MainLayout from "@/components/layouts/MainLayout";

export default function WomenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout mainCategory="Women" mainCategoryLink="/women-home">
      {children}
    </MainLayout>
  );
}
