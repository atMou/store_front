import { z } from "zod";

const attributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  description: z.string().min(1, "Attribute description is required"),
});

const materialDetailSchema = z.object({
  material: z.string().min(1, "Material is required"),
  percentage: z
    .number({ message: "Percentage is required" })
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100"),
  detail: z.string().min(1, "Detail is required"),
});

const variantSchema = z
  .object({
    images: z
      .array(z.instanceof(File))
      .min(1, "At least one image is required for each variant")
      .max(5, "Maximum 5 images allowed per variant"),
    isMain: z.array(z.boolean()),
    color: z.string().min(1, "Color is required for variant"),
  })
  .refine(
    (data) => {
      return (
        data.isMain.length === 0 || data.isMain.some((val) => val === true)
      );
    },
    {
      message: "At least one image must be marked as main",
      path: ["isMain"],
    }
  );

export const productFormSchema = z
  .object({
    slug: z
      .string()
      .min(5, "Slug is required")
      .max(50, "Slug must not exceed 100 characters"),

    images: z
      .array(z.instanceof(File))
      .min(1, "At least one product image is required")
      .max(7, "Maximum 7 images allowed"),
    isMain: z.array(z.boolean()),
    price: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Price must be greater than 0",
      }),
    newPrice: z
      .union([z.string(), z.number(), z.undefined()])
      .optional()
      .transform((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = typeof val === "string" ? parseFloat(val) : val;
        return isNaN(num) ? undefined : num;
      })
      .refine(
        (val) => val === undefined || (typeof val === "number" && val > 0),
        {
          message: "Sale price must be greater than 0",
        }
      ),
    brand: z.string().min(1, "Brand is required"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "Sub-category is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must not exceed 1000 characters"),

    detailsAttributes: z
      .array(attributeSchema)
      .min(1, "At least one attribute is required"),
    sizeFitAttributes: z
      .array(attributeSchema)
      .min(1, "At least one attribute is required"),

    materialDetails: z
      .array(materialDetailSchema)
      .min(1, "At least one material detail is required"),

    type: z.string().min(1, "Product type is required"),
    subType: z.string().min(1, "Product sub-type is required"),

    variants: z
      .array(variantSchema)
      .min(1, "At least one variant is required")
      .refine(
        (variants) => {
          const colors = variants.map((v) => v.color.toLowerCase().trim());
          const uniqueColors = new Set(colors);
          return colors.length === uniqueColors.size;
        },
        {
          message: "Duplicate color variants are not allowed",
          path: ["variants"],
        }
      ),
  })
  .refine(
    (data) => {
      if (data.newPrice !== null && data.newPrice !== undefined) {
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
      return (
        data.isMain.length === 0 || data.isMain.some((val) => val === true)
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
  );

export type ProductFormSchema = z.output<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;
export type VariantFormSchema = z.infer<typeof variantSchema>;

export type AttributeFormSchema = z.infer<typeof attributeSchema>;
export type MaterialDetailSchema = z.infer<typeof materialDetailSchema>;

export { attributeSchema, materialDetailSchema, variantSchema };
