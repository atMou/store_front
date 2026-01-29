"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/ui";
import { ChevronBackIcon, ChevronRightIcon } from "@/shared/ui/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { KidsTabPanels, MenTabPanels, WomenTabPanels } from "../data";
import { selectMainCategory } from "../slice";
import CarouselLink from "./CarouselLink";

const CarouselBar = () => {
  const [, setApi] = useState<CarouselApi>();
  const mainCategory = useSelector(selectMainCategory);

  const tabPanels =
    mainCategory === "Men"
      ? MenTabPanels
      : mainCategory === "Women"
        ? WomenTabPanels
        : mainCategory === "Kids"
          ? KidsTabPanels
          : null;

  if (!tabPanels) return null;

  const groups = tabPanels.tabs.map((tab) => tab.group);

  return (
    <div className="relative px-8 flex-1">
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
          containScroll: "trimSnaps",
          slidesToScroll: 3,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {groups.map((group) => (
            <CarouselItem key={group} className="grow-0 shrink-0 basis-auto">
              <CarouselLink subCategory={group} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          icon={<ChevronBackIcon size="30" />}
          className="absolute -left-6 top-1/2 shadow-none! bg-gray-200 border-0 rounded-none w-7 h-7 flex items-center justify-center hover:bg-gray-300!"
        />
        <CarouselNext
          icon={<ChevronRightIcon size="30" />}
          className="absolute -right-8 top-1/2 shadow-none! bg-gray-200 border-0 rounded-none w-7 h-7 flex items-center justify-center hover:bg-gray-300!"
        />
      </Carousel>
    </div>
  );
};

export default CarouselBar;
