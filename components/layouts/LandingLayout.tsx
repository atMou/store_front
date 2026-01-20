"use client";
import TabPanelDropdown from "@/features/category/components/TabPanelDropdown";
import React from "react";
import Header from "./header/Header";
import SubHeader from "./header/SubHeader";
import Footer from "./Footer";

function LandingLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <SubHeader />
      <TabPanelDropdown />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default LandingLayout;
