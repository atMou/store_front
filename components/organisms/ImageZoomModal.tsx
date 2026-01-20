"use client";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  alt,
}) => {
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Inverse the position for the zoom effect
    setPosition({ x: 100 - x, y: 100 - y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>

      {/* Image container */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4">
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg bg-white"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isZooming ? "zoom-in" : "default" }}
        >
          <div
            ref={imageRef}
            className="relative w-full h-full transition-transform duration-100 ease-out"
            style={{
              transform: isZooming ? "scale(2.5)" : "scale(1)",
              transformOrigin: isZooming
                ? `${position.x}% ${position.y}%`
                : "center",
            }}
          >
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1536px) 100vw, 1536px"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
          {isZooming ? "Move mouse to explore" : "Hover to zoom"}
        </div>
      </div>
    </div>
  );
};

export default ImageZoomModal;
