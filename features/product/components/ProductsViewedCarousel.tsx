"use client";
import {
  FilterValues,
  Product,
  selectViewedProducts,
} from "@/features/product";
import { ProductCard } from "@/features/product/components";
import { useInfiniteProducts } from "@/features/product/hooks/useInfiniteProducts";
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/ui";
import { PlusIcon } from "@/shared/ui/icons";
import { useAppSelector } from "@/store";
import React from "react";
type ProductsViewedCarouselProps = {
  currentProductId: string;
};

function ProductsViewedCarousel({
  currentProductId,
}: ProductsViewedCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const products = useAppSelector(selectViewedProducts);

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

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 w-full select-none ">
      <div className="w-full ">
        <Carousel
          opts={{
            align: "end",
            containScroll: false,
            dragFree: true,
            slidesToScroll: 4,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="gap-2 md:gap-4 -ml-2 md:-ml-4">
            {products?.map((p) => {
              return (
                p.id != currentProductId && (
                  <CarouselItem
                    key={p.id}
                    className="basis-auto min-w-[180px] md:min-w-[220px] pl-2 md:pl-2"
                  >
                    <ProductCard product={p} isLoading={false} />
                  </CarouselItem>
                )
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
        <div className="w-full pl-5 mt-4">
          <Button
            variant="plain"
            className="group relative gap-2 border px-2 py-5 overflow-hidden hover:bg-slate-600 hover:text-white rounded-none"
          >
            <PlusIcon size="20" />
            Follow
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductsViewedCarousel;
