import { ArrowRight } from "lucide-react";
import Link from "next/link";

type TextBannerProps = {
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
  textDirection?: "ltr" | "rtl" | "center";
  backgroundColor?: string;
};

function TextBanner({
  title = "Up to 70% off on winter styles",
  subtitle = "Our winter sale is ending soon!",
  linkText = "Save now",
  linkHref = "/",
  className,
  textDirection = "center",
  backgroundColor = "#D84E33",
}: TextBannerProps) {
  const alignmentClass =
    textDirection === "rtl"
      ? "text-right"
      : textDirection === "ltr"
        ? "text-left"
        : "text-center";

  return (
    <div className={`text-white py-6 ${className}`} style={{ backgroundColor }}>
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${alignmentClass}`}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-1">{title}</h2>
        <p className="text-lg md:text-xl font-normal mb-3">{subtitle}</p>
        <Link
          href={linkHref}
          className="inline-flex items-center gap-2 text-base font-semibold hover:underline transition-all"
        >
          {linkText}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default TextBanner;
