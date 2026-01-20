import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.email({ message: "Invalid email address." }),
  password: z
    .string()
    .refine(
      (val) =>
        val.length >= 8 &&
        val.length <= 20 &&
        /[A-Z]/.test(val) &&
        /[a-z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      {
        message:
          "Password must be 8–20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }
    ),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
