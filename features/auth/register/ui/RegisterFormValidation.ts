import { z } from "zod";

export const credentialFormSchema = z
  .object({
    email: z.email({ message: "Invalid email address." }),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{7,14}$/, { message: "Invalid phone number." })
      .optional(),
    password: z
      .string()
      .min(8)
      .max(20)
      .refine(
        (val) =>
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /[0-9]/.test(val) &&
          /[^A-Za-z0-9]/.test(val),
        {
          message:
            "Password must contain upper, lower, number, and special character.",
        }
      ),
    passwordConfirm: z.string(),
    rememberMe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match.",
  });

export type CredentialsFormSchemaType = z.infer<typeof credentialFormSchema>;

export const codeVerificationSchema = z.object({
  code: z.string().length(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type CodeVerificationSchema = z.infer<typeof codeVerificationSchema>;

export const ProfileFormSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters long." })
    .max(20, { message: "First name must be at most 20 characters long." })
    .optional(),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters long." })
    .max(20, { message: "Last name must be at most 20 characters long." })
    .optional(),
  age: z
    .number({ message: "Age must be a number." })
    .min(13, { message: "You must be at least 13 years old." })
    .max(120, { message: "Please enter a valid age." })
    .optional(),
  gender: z
    .enum(["male", "female", "other"], {
      message: "Please select a valid gender.",
    })
    .optional(),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long." })
    .optional(),
  street: z
    .string()
    .min(2, { message: "Street must be at least 2 characters long." })
    .optional(),
  postalCode: z
    .number({ message: "Postal code must be a number." })
    .positive({ message: "Postal code must be positive." })
    .optional(),
  houseNumber: z
    .number({ message: "House number must be a number." })
    .positive({ message: "House number must be positive." })
    .optional(),
  extraDetails: z
    .string()
    .max(200, { message: "Extra details must be at most 200 characters." })
    .optional(),
  avatar: z
    .instanceof(File, { message: "Please upload a valid image file." })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      }
    )
    .refine((file) => file.size <= 5000000, {
      message: "Image size must be less than 5MB.",
    })
    .optional(),
});

export type ProfileFormSchemaType = z.infer<typeof ProfileFormSchema>;
