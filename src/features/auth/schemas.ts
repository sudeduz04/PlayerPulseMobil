import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'E-posta zorunlu').email('Geçerli bir e-posta girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
    surname: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
    email: z.string().min(1, 'E-posta zorunlu').email('Geçerli bir e-posta girin'),
    phone: z.string(),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
    password_confirmation: z.string().min(6, 'Şifre tekrarı zorunlu'),
    role: z.literal('player'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Şifreler eşleşmiyor',
  });

export type RegisterValues = z.infer<typeof registerSchema>;
