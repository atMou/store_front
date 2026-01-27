"use client";
import SectionHeader from "@/components/molecules/SectionHeader";
import { useInfiniteLikedProducts } from "@/features/product";
import { ProductCard } from "@/features/product/components";
import { cn } from "@/shared/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/ui";
import { Heart } from "lucide-react";
import React from "react";

interface ProductsLikedCarouselProps {
  itemSize?: "small" | "medium" | "large";
  direction?: "rtl" | "ltr";
}

const sizeClasses = {
  small: "basis-1/3 md:basis-1/6 lg:basis-1/8 xl:basis-[10%] 2xl:basis-1/12",
  medium: "basis-1/3 md:basis-1/5 lg:basis-1/6 xl:basis-[14.28%] 2xl:basis-1/8",
  large: "basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.28%]",
};

function ProductsLikedCarousel({
  itemSize = "medium",
  direction = "rtl",
}: ProductsLikedCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const isCentered = !canScrollPrev && !canScrollNext && !!api;

  const { products, isLoading } = useInfiniteLikedProducts({
    include: "variants",
  });

  React.useEffect(() => {
    if (!api) return;

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollState();
    api.on("select", updateScrollState);
    api.on("reInit", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api]);

  if (!isLoading && products && products.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto  w-full select-none ">
      <SectionHeader
        title="Items you liked"
        icon={<Heart className="w-5 h-5 text-red-500" />}
        direction={direction}
      />
      <div className="w-full ">
        <Carousel
          opts={{
            align: "start",
            direction: direction,
            containScroll: false,
            dragFree: true,
            slidesToScroll: 5,
          }}
          setApi={setApi}
          className="w-full"
          dir={direction}
        >
          <CarouselContent
            className={cn(
              direction === "rtl" ? "ml-0 -mr-2" : "-ml-2",
              isCentered && "justify-center"
            )}
          >
            {products?.map((p) => {
              return (
                <CarouselItem
                  key={p.id}
                  className={cn(
                    "basis-auto",
                    direction === "rtl" ? "pl-0 pr-2" : "pl-2",
                    sizeClasses[itemSize]
                  )}
                >
                  <ProductCard
                    product={p}
                    isLoading={isLoading}
                    size={itemSize}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious
            className={`left-[455px] ${!canScrollPrev && "hidden"}`}
          />
          <CarouselNext
            className={`right-[305px] ${!canScrollNext && "hidden"}`}
          />
        </Carousel>
      </div>
    </div>
  );
}

export default ProductsLikedCarousel;
