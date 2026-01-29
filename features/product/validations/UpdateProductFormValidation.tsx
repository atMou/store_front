import { z } from "zod";

const updateAttributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  description: z.string().min(1, "Attribute description is required"),
});

const updateMaterialDetailSchema = z.object({
  material: z.string().min(1, "Material is required"),
  percentage: z
    .number({ message: "Percentage is required" })
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100"),
  detail: z.string().min(1, "Detail is required"),
});

const updateSizeVariantSchema = z
  .object({
    sizeVariantId: z.string().optional(),
    size: z.string().min(1, "Size is required"),
    stock: z
      .number({ message: "Stock is required" })
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative"),
    stockLow: z
      .number({ message: "Stock Low is required" })
      .int("Stock Low must be a whole number")
      .min(0, "Stock Low cannot be negative"),
    stockMid: z
      .number({ message: "Stock Mid is required" })
      .int("Stock Mid must be a whole number")
      .min(0, "Stock Mid cannot be negative"),
    stockHigh: z
      .number({ message: "Stock High is required" })
      .int("Stock High must be a whole number")
      .min(0, "Stock High cannot be negative"),
    isDeleted: z.boolean().optional(),
  })
  .refine(
    (data) => {
      return data.stockLow <= data.stockMid && data.stockMid <= data.stockHigh;
    },
    {
      message: "Stock levels must be in order: Low ≤ Mid ≤ High",
      path: ["stockLow"],
    }
  )
  .refine(
    (data) => {
      return data.stock <= data.stockHigh;
    },
    {
      message: "Current stock cannot exceed Stock High threshold",
      path: ["stock"],
    }
  );

const updateVariantImageSchema = z.object({
  productImageId: z.string(),
  url: z.string().url("Invalid image URL"),
  altText: z.string().min(1, "Alt text is required"),
  isMain: z.boolean(),
  isDeleted: z.boolean().optional(),
  variantId: z.string(),
});

const updateProductImageSchema = z.object({
  productImageId: z.string(),
  url: z.string().url("Invalid image URL"),
  altText: z.string().min(1, "Alt text is required"),
  isMain: z.boolean(),
  isDeleted: z.boolean().optional(),
  productId: z.string(),
});

const updateVariantSchema = z
  .object({
    variantId: z.string().optional(),
    images: z
      .array(z.instanceof(File))
      .max(5, "Maximum 5 images allowed per variant")
      .optional(),
    isMain: z.array(z.boolean()).optional(),
    color: z.string().min(1, "Color is required for variant"),
    imageDtos: z.array(updateVariantImageSchema).optional(),
    sizeVariants: z.array(updateSizeVariantSchema).optional(),
    isDeleted: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const activeImageDtos = (data.imageDtos || []).filter(
        (img) => !img.isDeleted
      );
      const hasImages =
        activeImageDtos.length > 0 || (data.images && data.images.length > 0);
      return hasImages;
    },
    {
      message: "Variant must have at least one image",
      path: ["images"],
    }
  )
  .refine(
    (data) => {
      const activeImageDtos = (data.imageDtos || []).filter(
        (img) => !img.isDeleted
      );
      const hasMainInExisting = activeImageDtos.some(
        (img) => img.isMain === true
      );
      const hasMainInNew = data.isMain?.some((val) => val === true);

      if (hasMainInExisting) return true;

      if (data.images && data.images.length > 0) {
        return hasMainInNew;
      }

      return (
        activeImageDtos.length === 0 &&
        (!data.images || data.images.length === 0)
      );
    },
    {
      message: "At least one image must be marked as main",
      path: ["isMain"],
    }
  )
  .refine(
    (data) => {
      if (!data.variantId && !data.isDeleted) {
        return data.sizeVariants && data.sizeVariants.length > 0;
      }
      return true;
    },
    {
      message: "At least one size variant is required for new variants",
      path: ["sizeVariants"],
    }
  )
  .refine(
    (data) => {
      if (data.sizeVariants && data.sizeVariants.length > 0) {
        const activeSizes = data.sizeVariants
          .filter((sv) => !sv.isDeleted)
          .map((sv) => sv.size.toLowerCase().trim());
        const uniqueSizes = new Set(activeSizes);
        return activeSizes.length === uniqueSizes.size;
      }
      return true;
    },
    {
      message: "Duplicate sizes are not allowed for the same variant",
      path: ["sizeVariants"],
    }
  );

export const updateProductFormSchema = z
  .object({
    productId: z.string().min(1, "Product ID is required"),
    slug: z
      .string()
      .min(5, "Slug is required")
      .max(50, "Slug must not exceed 100 characters"),
    images: z
      .array(z.instanceof(File))
      .max(5, "Maximum 5 new images allowed")
      .optional(),
    isMain: z.array(z.boolean()).optional(),
    price: z.number().min(0, "Price must be positive"),
    newPrice: z.number().min(0, "New price must be positive").optional(),
    brand: z.string().min(1, "Brand is required"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "Sub-category is required"),

    type: z.string().min(1, "Product type is required"),
    subType: z.string().min(1, "Product sub-type is required"),

    description: z.string().min(1, "Description is required"),

    detailsAttributes: z
      .array(updateAttributeSchema)
      .min(1, "At least one attribute is required"),
    sizeFitAttributes: z
      .array(updateAttributeSchema)
      .min(1, "At least one attribute is required"),

    materialDetails: z
      .array(updateMaterialDetailSchema)
      .min(1, "At least one material detail is required"),

    isFeatured: z.boolean(),
    isNew: z.boolean(),
    isBestSeller: z.boolean(),
    isTrending: z.boolean(),
    imageDtos: z.array(updateProductImageSchema),
    variants: z
      .array(updateVariantSchema)
      .min(1, "At least one variant is required"),
    alternativesIds: z.array(z.string()),
  })
  .refine(
    (data) => {
      if (data.newPrice !== undefined && data.newPrice !== null) {
        return data.newPrice < data.price;
      }
      return true;
    },
    {
      message: "Sale price must be less than regular price",
      path: ["newPrice"],
    }
  )
  .refine(
    (data) => {
      const activeImageDtos = data.imageDtos.filter((img) => !img.isDeleted);
      const hasImages =
        activeImageDtos.length > 0 || (data.images && data.images.length > 0);
      return hasImages;
    },
    {
      message: "Product must have at least one image",
      path: ["images"],
    }
  )
  .refine(
    (data) => {
      const activeImageDtos = data.imageDtos.filter((img) => !img.isDeleted);
      const hasMainInExisting = activeImageDtos.some(
        (img) => img.isMain === true
      );
      const hasMainInNew = data.isMain?.some((val) => val === true);

      if (hasMainInExisting) return true;

      if (data.images && data.images.length > 0) {
        return hasMainInNew;
      }

      return (
        activeImageDtos.length === 0 &&
        (!data.images || data.images.length === 0)
      );
    },
    {
      message: "At least one product image must be marked as main",
      path: ["isMain"],
    }
  )
  .refine(
    (data) => {
      const attributeNames = data.detailsAttributes.map((attr) =>
        attr.name.toLowerCase().trim()
      );
      const uniqueNames = new Set(attributeNames);
      return attributeNames.length === uniqueNames.size;
    },
    {
      message: "Duplicate attribute names are not allowed in details",
      path: ["detailsAttributes"],
    }
  )
  .refine(
    (data) => {
      const attributeNames = data.sizeFitAttributes.map((attr) =>
        attr.name.toLowerCase().trim()
      );
      const uniqueNames = new Set(attributeNames);
      return attributeNames.length === uniqueNames.size;
    },
    {
      message: "Duplicate attribute names are not allowed in size & fit",
      path: ["sizeFitAttributes"],
    }
  )
  .refine(
    (data) => {
      const materials = data.materialDetails.map((mat) =>
        mat.material.toLowerCase().trim()
      );
      const uniqueMaterials = new Set(materials);
      return materials.length === uniqueMaterials.size;
    },
    {
      message: "Duplicate materials are not allowed",
      path: ["materialDetails"],
    }
  )
  .superRefine((data, ctx) => {
    const activeVariants = data.variants.filter((v) => !v.isDeleted);
    const colors = activeVariants.map((v) => v.color.toLowerCase().trim());
    const uniqueColors = new Set(colors);

    if (colors.length !== uniqueColors.size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate color variants are not allowed",
        path: ["variants"],
      });
    }

    data.variants.forEach((variant, index) => {
      if (variant.isDeleted) return;

      const activeImageDtos =
        variant.imageDtos?.filter((img) => !img.isDeleted) || [];
      const hasImages =
        activeImageDtos.length > 0 ||
        (variant.images && variant.images.length > 0);
      if (!hasImages) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Variant ${variant.color} must have at least one image`,
          path: ["variants", index, "images"],
        });
      }
    });
  });

export type UpdateProductFormSchema = z.infer<typeof updateProductFormSchema>;
export type UpdateVariantFormSchema = z.infer<typeof updateVariantSchema>;
export type UpdateSizeVariantFormSchema = z.infer<
  typeof updateSizeVariantSchema
>;

export type UpdateAttributeFormSchema = z.infer<typeof updateAttributeSchema>;
export type UpdateMaterialDetailSchema = z.infer<
  typeof updateMaterialDetailSchema
>;
export type UpdateProductImageFormSchema = z.infer<
  typeof updateProductImageSchema
>;
export type UpdateVariantImageFormSchema = z.infer<
  typeof updateVariantImageSchema
>;

export {
  updateAttributeSchema,
  updateMaterialDetailSchema,
  updateVariantSchema,
};
