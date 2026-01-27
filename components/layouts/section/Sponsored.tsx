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
  href?: string;
  sponsored?: boolean;
  reverse?: boolean;
  buttonClassName?: string;
  backgroundColor?: string;
  align?: "left" | "center" | "right";
  textColor?: string;
  padding: "top" | "bottom" | "both" | "none";
}

const Sponsored: React.FC<BannerProps> = ({
  imageSrc,
  imageAlt = "Promotional image",
  title,
  subtitle,
  buttonText,
  href,
  sponsored = true,
  reverse = false,
  buttonClassName,
  titleClassName,
  subtitleClassName,
  backgroundColor = "bg-gray-200",
  align = "left",
  textColor,
  children,
  padding = "none",

}) => {
  const backgroundClassName = backgroundColor?.startsWith("bg-")
    ? backgroundColor
    : "";
  const backgroundStyle = backgroundColor?.startsWith("bg-")
    ? undefined
    : { backgroundColor };

  const alignmentClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";
  const justifyClass =
    align === "center"
      ? "justify-center"
      : align === "right"
        ? "justify-end"
        : "justify-start";
  const textColorClass = textColor?.startsWith("text-") ? textColor : "";
  const textColorStyle = textColor?.startsWith("text-")
    ? undefined
    : textColor
      ? { color: textColor }
      : undefined;

  return (
    <div className={backgroundClassName} style={backgroundStyle}>
      <div
        className={`flex flex-col max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 mt-5 mb-5 ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        }
        ${
          padding === "top"
            ? "pt-8"
            : padding === "bottom"
              ? "pb-8"
              : padding === "both"
                ? "pt-10 pb-10"
                : ""
        }`}
      >
        <div className="md:w-1/2  relative ">
          <Image
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto object-cover"
            width={600}
            height={600}
          />
        </div>
        <div
          className={`md:w-1/2 pl-4 self-center ${alignmentClass} ${textColorClass}`}
          style={textColorStyle}
        >
          {sponsored && (
            <p
              className={`text-xs mb-2 flex items-center space-x-1.5 ${textColorClass} ${justifyClass}`}
            >
              <span  >Sponsored</span> <InfoIcon size="10" />
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
          {href && (
            <Link href={href}>
              <Button
                variant="outline"
                className={`px-14 bg-transparent hover:bg-black hover:text-white border-2 ${buttonClassName}`}
              >
                {buttonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
