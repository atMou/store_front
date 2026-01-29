import { z } from "zod";

const updateInventorySizeSchema = z
  .object({
    sizeVariantId: z.union([
      z.string().uuid("Invalid size variant ID"),
      z.literal(""),
    ]),
    size: z.string().min(1, "Size is required"),
    stock: z
      .number({ message: "Stock is required" })
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative"),
    low: z
      .number({ message: "Low threshold is required" })
      .int("Low threshold must be a whole number")
      .min(0, "Low threshold cannot be negative"),
    mid: z
      .number({ message: "Mid threshold is required" })
      .int("Mid threshold must be a whole number")
      .min(0, "Mid threshold cannot be negative"),
    high: z
      .number({ message: "High threshold is required" })
      .int("High threshold must be a whole number")
      .min(0, "High threshold cannot be negative"),
    warehouses: z.array(z.string()),
  })
  .refine(
    (data) => {
      return data.low <= data.mid && data.mid <= data.high;
    },
    {
      message: "Thresholds must be in order: Low ≤ Mid ≤ High",
      path: ["low"],
    }
  )
  .refine(
    (data) => {
      return data.stock <= data.high;
    },
    {
      message: "Current stock cannot exceed High threshold",
      path: ["stock"],
    }
  );

const updateInventoryColorSchema = z.object({
  colorVariantId: z.string().uuid("Invalid color variant ID"),
  sizeVariants: z.array(updateInventorySizeSchema),
});

export const updateInventoryFormSchema = z.object({
  id: z.string().uuid("Invalid inventory ID"),
  colorVariants: z
    .array(updateInventoryColorSchema)
    .min(1, "At least one color variant is required"),
});

export type UpdateInventoryFormSchema = z.infer<
  typeof updateInventoryFormSchema
>;

export type UpdateInventorySizeSchema = z.infer<
  typeof updateInventorySizeSchema
>;

export type UpdateInventoryColorSchema = z.infer<
  typeof updateInventoryColorSchema
>;
