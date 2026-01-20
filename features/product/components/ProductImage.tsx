"use client";

import { generateProductPlaceholder } from "@/shared/lib/placeholderImage";
import Image from "next/image";
import { useState } from "react";

type Props = {
  id: string;
  url: string;
  altText: string;
  brand: string;
};

function ProductImage({ url, altText, brand }: Props) {
  const imgSrc = url && url !== "" ? url : generateProductPlaceholder(brand);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(imgSrc);

  return (
    <div
      className={`relative w-full h-full transition-transform hover:scale-[1.05] duration-300 ease-in-out `}
    >
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse`}></div>
      )}
      <Image
        onError={() => {
          setIsLoading(false);
          setCurrentSrc(generateProductPlaceholder(brand));
        }}
        onLoad={() => setIsLoading(false)}
        src={currentSrc}
        alt={altText || "Product image"}
        className="object-center object-cover w-full h-full"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={95}
        loading="lazy"
      />
    </div>
  );
}

export default ProductImage;
