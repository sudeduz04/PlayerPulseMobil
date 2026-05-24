import { z } from "zod";

export const ROLES = ["super_admin", "manager", "coach", "player"] as const;

export const userSchema = z
  .object({
    name: z.string().min(2, "Ad en az 2 karakter olmalı"),
    surname: z.string().min(2, "Soyad en az 2 karakter olmalı"),
    email: z.string().email("Geçerli bir e-posta gir"),
    phone: z.string().optional().nullable(),
    role: z.enum(ROLES),
    status: z.boolean(),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı")
      .optional()
      .or(z.literal("")),
    password_confirmation: z.string().optional().or(z.literal("")),
  })
  .refine((v) => !v.password || v.password === v.password_confirmation, {
    message: "Şifreler eşleşmiyor",
    path: ["password_confirmation"],
  });

export type UserFormValues = z.infer<typeof userSchema>;
