"use client";

import { useProductSection } from "@/features/product/hooks/useProductSection";
import { Product } from "@/features/product/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BrandSlide {
  id: string;
  brandName: string;
  tagline: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  heroImages: string[];
}

interface BrandSectionProps {
  slides: BrandSlide[];
}

function ProductMiniCard({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];

  return (
    <div className="flex gap-3 items-start">
      <div className="w-16 h-20 bg-gray-100 shrink-0">
        <Image
          src={mainImage?.url || "/placeholder.jpg"}
          alt={mainImage?.altText || product.slug}
          width={64}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{product.brand}</div>
        <div className="text-xs text-gray-600 line-clamp-2">{product.slug}</div>
        <div className="mt-1">
          {product.newPrice ? (
            <>
              <span className="text-red-600 font-bold text-sm">
                €{product.newPrice.toFixed(2)}
              </span>
              <div className="text-xs text-gray-500">
                Regular price:{" "}
                <span className="line-through">
                  €{product.price.toFixed(2)}
                </span>
              </div>
              {product.discount && (
                <span className="text-xs text-red-600">
                  -{product.discount}%
                </span>
              )}
              {product.status.isBestSeller && (
                <span className="inline-block mt-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  Deal
                </span>
              )}
            </>
          ) : (
            <span className="font-bold text-sm">
              €{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <Heart
          size={20}
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
        />
      </button>
    </div>
  );
}

function BrandSlideContent({ slide }: { slide: BrandSlide }) {
  const { products, isLoading } = useProductSection(
    { brand: slide.brandName },
    4
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {}
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-1">{slide.brandName}</h2>
        <h3 className="text-2xl font-bold mb-4">{slide.tagline}</h3>
        <p className="text-gray-600 mb-4">{slide.subtitle}</p>
        <Link
          href={slide.ctaLink}
          className="inline-flex items-center gap-2 font-semibold hover:underline"
        >
          {slide.ctaText} <span>→</span>
        </Link>
      </div>

      {}
      <div className="flex gap-2">
        {slide.heroImages.slice(0, 2).map((img, idx) => (
          <div key={idx} className="flex-1 aspect-3/4 relative">
            <Image
              src={img}
              alt={`${slide.brandName} hero ${idx + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {}
      <div className="flex items-start justify-end">
        <div className="text-sm text-gray-500">Brand Showcase</div>
      </div>

      {}
      <div className="col-span-full">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {products.slice(0, 4).map((product) => (
              <ProductMiniCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrandSection({ slides }: BrandSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Carousel
        opts={{ loop: true }}
        className="w-full"
        setApi={(api) => {
          api?.on("select", () => {
            setCurrentSlide(api.selectedScrollSnap());
          });
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <BrandSlideContent slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {}
        <div className="flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 w-8 h-8" />
          <span className="text-sm">
            {currentSlide + 1} of {slides.length}
          </span>
          <CarouselNext className="static translate-y-0 w-8 h-8" />
        </div>
      </Carousel>

      {}
      <div className="mt-16">
        <h2 className="text-3xl font-bold">Forgetting someone?</h2>
        <p className="text-2xl">There&apos;s a gift for everyone</p>
      </div>
    </div>
  );
}
