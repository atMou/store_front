import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating is required")
    .max(5, "Rating cannot be more than 5"),
  comment: z
    .string()
    .min(3, "Comment must be at least 3 characters")
    .max(500, "Comment cannot exceed 500 characters"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
