"use client";

import HeaderIcon from "@/components/layouts/header/HeaderIcon";
import { selectUserLikedProductIds } from "@/features/user";
import { useAppSelector } from "@/store";
import { HeartIcon } from "lucide-react";
import LikedProductsDropdown from "./LikedProductsDropdown";

function LikedProductsIcon() {
  const likedProductIds = useAppSelector(selectUserLikedProductIds);

  return (
    <HeaderIcon
      icon={<HeartIcon strokeWidth={1} size={20} />}
      badgeCount={likedProductIds.length}
      badgeClassName="bg-black"
    >
      <LikedProductsDropdown />
    </HeaderIcon>
  );
}

export default LikedProductsIcon;
