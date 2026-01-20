"use client";
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/ui";
import { ChevronBackIcon, ChevronRightIcon, InfoIcon } from "@/shared/ui/icons";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CarouselImage {
  id: number | string;
  url: string;
  alt: string;
}

interface SponsorCarouselProps {
  images: CarouselImage[];
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  sponsored?: boolean;
  reverse?: boolean;
  backgroundColor?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  buttonClassName?: string;
  carouselClassName?: string;
  imageClassName?: string;
  maxHeight?: string;
}

function SponsorCarousel({
  images,
  title,
  subtitle,
  buttonText,
  buttonHref,
  onButtonClick,
  sponsored = true,
  reverse = false,
  backgroundColor = "bg-darkYellow",
  titleClassName = "text-2xl font-light mb-4",
  subtitleClassName = "text-gray-600 mt-2",
  buttonClassName = "px-10 py-6 border border-black w-fit bg-black text-white hover:opacity-70",
  carouselClassName = "",
  imageClassName = "object-cover object-center w-full",
  maxHeight = "590px",
}: SponsorCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

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

  const CarouselSection = (
    <div className="relative md:w-1/2">
      <Carousel
        opts={{
          align: "center",
          containScroll: "trimSnaps",
          dragFree: true,
          slidesToScroll: 1,
          loop: true,
          duration: 30,
        }}
        plugins={[autoplayPlugin.current]}
        setApi={setApi}
        className={carouselClassName}
      >
        <CarouselContent className="text-right p-0">
          {images?.map((img) => {
            return (
              <CarouselItem key={img.id} className="p-0">
                <Image
                  src={img.url}
                  alt={img.alt}
                  className={imageClassName}
                  style={{ maxHeight }}
                  width={800}
                  height={parseInt(maxHeight)}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {canScrollPrev && (
          <CarouselPrevious
            icon={<ChevronBackIcon size="34" />}
            className="bg-gray-100 p-4 rounded-none border-none absolute left-0"
          />
        )}
        {canScrollNext && (
          <CarouselNext
            icon={<ChevronRightIcon size="34" />}
            className="bg-gray-100 p-4 rounded-none border-none absolute right-0"
          />
        )}
      </Carousel>
    </div>
  );

  const ContentSection = (
    <div
      className={`w-1/2 ${backgroundColor} p-8 flex flex-col justify-center`}
      style={{ maxHeight }}
    >
      {sponsored && (
        <p
          className={`text-base text-primary mb-2 flex items-center space-x-1.5 ${
            reverse ? "justify-center" : "justify-start text-left"
          }`}
        >
          <span className="text-xs">Sponsored</span> <InfoIcon size="14" />
        </p>
      )}
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
      {buttonHref ? (
        <Link href={buttonHref}>
          <Button variant="plain" className={buttonClassName}>
            {buttonText}
          </Button>
        </Link>
      ) : (
        <Button
          variant="plain"
          onClick={onButtonClick}
          className={buttonClassName}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );

  return (
    <div
      className={`flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-stretch ${reverse ? "flex-row-reverse" : ""}`}
    >
      {reverse ? (
        <>
          {ContentSection}
          {CarouselSection}
        </>
      ) : (
        <>
          {CarouselSection}
          {ContentSection}
        </>
      )}
    </div>
  );
}

export default SponsorCarousel;
