"use client";

import { Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import ImagePreview, { ImagePreviewItem } from "./ImagePreview";

interface ImageUploaderProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  label: string;
  name?: Path<T>;
  maxFiles?: number;
  disabled?: boolean;
  multiple?: boolean;
  showMainSelector?: boolean; // New prop to enable main image selection
  isMainFieldName?: Path<T>; // Field name for isMain array
  variant?: "default" | "compact";
}

const ImageUploader = <T extends FieldValues = FieldValues>({
  control,
  errors,
  setValue,
  label,
  name = "images" as Path<T>,
  maxFiles = 5,
  disabled = false,
  multiple = true,
  showMainSelector = false,
  isMainFieldName = "isMain" as Path<T>,
  variant = "default",
}: ImageUploaderProps<T>) => {
  const [previews, setPreviews] = useState<ImagePreviewItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const effectiveMaxFiles = multiple ? maxFiles : 1;

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);

  const processFiles = useCallback(
    (files: File[]) => {
      if (!files.length) return;

      if (!multiple) {
        // Single file mode - replace existing
        const file = files[0];
        const newPreview = {
          url: URL.createObjectURL(file),
          file,
        };

        // Revoke old preview URL if exists
        if (previews.length > 0) {
          URL.revokeObjectURL(previews[0].url);
        }

        setPreviews([newPreview]);
        setValue(name, file as unknown as PathValue<T, Path<T>>, {
          shouldValidate: false,
        });

        // Set as main if selector is enabled
        if (showMainSelector) {
          setValue(
            isMainFieldName,
            [true] as unknown as PathValue<T, Path<T>>,
            {
              shouldValidate: false,
            }
          );
          setMainImageIndex(0);
        }
      } else {
        // Multiple files mode
        const currentFiles = previews.map((p) => p.file);
        const updatedFiles = [...currentFiles];
        const updatedPreviews = [...previews];

        files.forEach((file) => {
          // Check if file already exists by name and size
          const existingIndex = updatedFiles.findIndex(
            (f) => f?.name === file.name && f?.size === file.size
          );
          if (existingIndex !== -1) {
            // Overwrite existing
            URL.revokeObjectURL(updatedPreviews[existingIndex].url);
            updatedFiles[existingIndex] = file;
            updatedPreviews[existingIndex] = {
              url: URL.createObjectURL(file),
              file,
            };
          } else if (updatedFiles.length < effectiveMaxFiles) {
            // Add new
            updatedFiles.push(file);
            updatedPreviews.push({
              url: URL.createObjectURL(file),
              file,
            });
          }
        });

        setPreviews(updatedPreviews);
        setValue(name, updatedFiles as unknown as PathValue<T, Path<T>>, {
          shouldValidate: false,
        });

        // Update isMain array if selector is enabled
        if (showMainSelector) {
          const currentMainIndex = mainImageIndex;
          const isMainArray = updatedFiles.map(
            (_, index) => index === currentMainIndex
          );
          setValue(
            isMainFieldName,
            isMainArray as unknown as PathValue<T, Path<T>>,
            {
              shouldValidate: false,
            }
          );
        }
      }
    },
    [
      previews,
      setValue,
      name,
      effectiveMaxFiles,
      multiple,
      showMainSelector,
      isMainFieldName,
      mainImageIndex,
    ]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      processFiles(files);
      // Clear the input
      e.target.value = "";
    },
    [processFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      const updatedPreviews = [...previews];
      const removedPreview = updatedPreviews.splice(index, 1)[0];

      // Revoke blob URL
      URL.revokeObjectURL(removedPreview.url);

      setPreviews(updatedPreviews);

      if (!multiple) {
        setValue(name, undefined as unknown as PathValue<T, Path<T>>, {
          shouldValidate: false,
        });
        if (showMainSelector) {
          setValue(isMainFieldName, [] as unknown as PathValue<T, Path<T>>, {
            shouldValidate: false,
          });
          setMainImageIndex(0);
        }
      } else {
        const newFiles = updatedPreviews.map((p) => p.file);
        setValue(name, newFiles as unknown as PathValue<T, Path<T>>, {
          shouldValidate: false,
        });

        // Update isMain array when image is removed
        if (showMainSelector) {
          let newMainIndex = mainImageIndex;

          // If removed image was main, set first image as main
          if (index === mainImageIndex) {
            newMainIndex = 0;
            setMainImageIndex(0);
          }
          // If removed image was before main, decrement main index
          else if (index < mainImageIndex) {
            newMainIndex = mainImageIndex - 1;
            setMainImageIndex(newMainIndex);
          }

          const isMainArray = newFiles.map((_, i) => i === newMainIndex);
          setValue(
            isMainFieldName,
            isMainArray as unknown as PathValue<T, Path<T>>,
            {
              shouldValidate: false,
            }
          );
        }
      }
    },
    [
      previews,
      setValue,
      name,
      multiple,
      showMainSelector,
      isMainFieldName,
      mainImageIndex,
    ]
  );

  const canAddMore = previews.length < effectiveMaxFiles;

  const handleMainImageSelect = useCallback(
    (index: number) => {
      if (!showMainSelector) return;

      setMainImageIndex(index);

      // Create boolean array with only selected index as true
      const isMainArray = previews.map((_, i) => i === index);
      setValue(
        isMainFieldName,
        isMainArray as unknown as PathValue<T, Path<T>>,
        {
          shouldValidate: true,
        }
      );
    },
    [showMainSelector, previews, setValue, isMainFieldName]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || !canAddMore) return;

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length > 0) {
        processFiles(files);
      }
    },
    [disabled, canAddMore, processFiles]
  );

  const errorMessage = errors[name]?.message as string;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {multiple && effectiveMaxFiles > 1 && (
          <span className="text-gray-500 text-xs ml-1">
            ({previews.length}/{effectiveMaxFiles})
          </span>
        )}
      </label>

      {/* Image Previews */}
      <ImagePreview
        previews={previews.map((p, idx) => ({
          ...p,
          isMain: mainImageIndex === idx,
        }))}
        name={name}
        disabled={disabled}
        showMainSelector={showMainSelector}
        enableDragDrop={true}
        onReorder={(newOrder) => {
          const reorderedPreviews = newOrder.map((item) => {
            const found = previews.find(
              (p) =>
                (p.file && item.file && p.file.name === item.file.name) ||
                p.url === item.url
            );
            return found || item;
          });
          setPreviews(reorderedPreviews);
          const newFiles = reorderedPreviews
            .map((p) => p.file)
            .filter((f): f is File => f !== undefined);
          setValue(name, newFiles as unknown as PathValue<T, Path<T>>, {
            shouldValidate: false,
          });

          // Update main image index if needed
          if (showMainSelector) {
            const newMainIndex = newOrder.findIndex((item) => item.isMain);
            if (newMainIndex !== -1) {
              setMainImageIndex(newMainIndex);
              const isMainArray = newFiles.map((_, i) => i === newMainIndex);
              setValue(
                isMainFieldName,
                isMainArray as unknown as PathValue<T, Path<T>>,
                { shouldValidate: false }
              );
            }
          }
        }}
        onRemove={removeImage}
        onSelectMain={handleMainImageSelect}
      />

      {/* File Input */}
      <Controller
        name={name}
        control={control}
        render={() => (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileUpload}
              disabled={disabled || !canAddMore}
              className="hidden"
              id={`file-input-${name}`}
            />
            <label
              htmlFor={`file-input-${name}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                flex flex-col items-center justify-center w-full ${variant === "compact" ? "p-3" : "p-6"} border-2 border-dashed rounded-lg cursor-pointer transition-all
                ${
                  disabled || !canAddMore
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                    : dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                }
              `}
            >
              <Upload
                size={24}
                className={
                  disabled || !canAddMore ? "text-gray-400" : "text-gray-500"
                }
              />
              <p
                className={`mt-2 text-sm ${
                  disabled || !canAddMore ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {!canAddMore
                  ? multiple
                    ? `Maximum ${effectiveMaxFiles} files reached`
                    : "Image already uploaded"
                  : multiple
                    ? "Click to upload images or drag and drop"
                    : "Click to upload image"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB each
              </p>
            </label>
          </div>
        )}
      />

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
