import { Button } from "@/shared/ui";
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { type ReactNode } from "react";

interface BannerProps {
  children?: ReactNode;
  imageSrc: string;
  imageAlt?: string;
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  buttonText: string;
  clickAction?: () => void;
  href?: string;
  sponsored?: boolean;
  reverse?: boolean;
  buttonClassName?: string;
  backgroundColor?: string;
}

const Sponsored: React.FC<BannerProps> = ({
  imageSrc,
  imageAlt = "Promotional image",
  title,
  subtitle,
  buttonText,
  clickAction,
  href,
  sponsored = true,
  reverse = false,
  buttonClassName,
  titleClassName,
  subtitleClassName,
  backgroundColor = "bg-gray-200",
  children,
}) => {
  return (
    <div className={`${backgroundColor}`}>
      <div
        className={`flex flex-col max-w-7xl mx-auto  ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        }   `}
      >
        <div className="md:w-1/2  relative h-[300px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            className="object-contain object-bottom"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div
          className={`md:w-1/2 pl-4 self-center ${
            reverse ? "text-center" : "text-left"
          } `}
        >
          {sponsored && (
            <p
              className={`text-xs  mb-2 flex items-center space-x-1.5 ${
                reverse ? "justify-center pb-2" : "justify-start text-left"
              }`}
            >
              <span>Sponsored</span> <InfoIcon size="10" />
            </p>
          )}
          {title && (
            <h2 className={`font-bold mb-2   ${titleClassName} `}>{title}</h2>
          )}
          {subtitle && (
            <h3 className={`text-sm mb-4  ${subtitleClassName} `}>
              {subtitle}
            </h3>
          )}
          {children}
          {href ? (
            <Link href={href}>
              <Button
                variant="outline"
                className={`px-14 bg-transparent hover:bg-black hover:text-white border-2 ${buttonClassName}`}
              >
                {buttonText}
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={clickAction}
              className={`px-14 bg-transparent hover:bg-black hover:text-white border-2 ${buttonClassName}`}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
