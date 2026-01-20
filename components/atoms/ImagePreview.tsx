"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ImagePreviewItem {
  url: string;
  file?: File;
  id?: string;
  altText?: string;
  isMain?: boolean;
}

interface ImagePreviewProps {
  previews: ImagePreviewItem[];
  name: string;
  disabled?: boolean;
  showMainSelector?: boolean;
  enableDragDrop?: boolean;
  onRemove: (index: number) => void;
  onSelectMain?: (index: number) => void;
  onReorder?: (newOrder: ImagePreviewItem[]) => void;
  statusLabel?: (index: number, isMain: boolean) => string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  previews,
  name,
  disabled = false,
  showMainSelector = false,
  enableDragDrop = true,
  onRemove,
  onSelectMain,
  onReorder,
  statusLabel,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback(
    (index: number) => {
      if (!enableDragDrop || disabled) return;
      setDraggedIndex(index);
    },
    [enableDragDrop, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (!enableDragDrop || disabled) return;
      setDragOverIndex(index);
    },
    [enableDragDrop, disabled]
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!enableDragDrop || disabled) return;
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [enableDragDrop, disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      if (!enableDragDrop || disabled) return;

      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      // Reorder previews
      const newPreviews = [...previews];
      const [draggedItem] = newPreviews.splice(draggedIndex, 1);
      newPreviews.splice(dropIndex, 0, draggedItem);

      onReorder?.(newPreviews);

      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [enableDragDrop, disabled, draggedIndex, previews, onReorder]
  );

  if (previews.length === 0) return null;

  const getKey = (preview: ImagePreviewItem, index: number) => {
    return preview.id || preview.file?.name || `preview-${index}`;
  };

  const getAltText = (preview: ImagePreviewItem, index: number) => {
    return preview.altText || `Preview ${index + 1}`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {previews.map((preview, index) => {
        const isMain = preview.isMain === true;

        return (
          <div
            key={getKey(preview, index)}
            draggable={enableDragDrop && !disabled}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative group aspect-square rounded-lg border-2 overflow-hidden bg-gray-50 transition-all ${
              enableDragDrop && !disabled ? "cursor-move" : ""
            } ${
              draggedIndex === index
                ? "opacity-50 scale-95 border-blue-400"
                : dragOverIndex === index
                  ? "border-blue-500 scale-105"
                  : "border-gray-200 hover:border-gray-300"
            } ${disabled ? "cursor-not-allowed" : ""}`}
          >
            <Image
              src={preview.url}
              alt={getAltText(preview, index)}
              fill
              className="object-cover pointer-events-none rounded"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />

            {/* Main Image Radio Button */}
            {showMainSelector && (
              <label className="absolute top-1 left-1 flex items-center gap-1 bg-white/90 px-2 py-1 rounded cursor-pointer z-10 shadow-sm">
                <input
                  type="radio"
                  name={`${name}-main-image`}
                  checked={isMain}
                  onChange={() => onSelectMain?.(index)}
                  disabled={disabled}
                  className="cursor-pointer disabled:cursor-not-allowed w-4 h-4"
                  aria-label="Set as main image"
                />
                <span className="text-xs font-medium text-gray-700">Main</span>
              </label>
            )}

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={disabled}
              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              aria-label="Remove image"
            >
              <Trash2 size={14} />
            </button>

            {/* Status indicator */}
            {isMain && (
              <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                {statusLabel ? statusLabel(index, isMain) : "Main"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImagePreview;
export type { ImagePreviewItem };
