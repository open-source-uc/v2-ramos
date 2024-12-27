import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Debes ingresar un nombre!" })
      .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    lastname: z
      .string()
      .min(1, { message: "Debes ingresar un apellido!" })
      .min(3, { message: "El apellido debe tener al menos 3 caracteres" }),
    email: z.string().email({ message: "Correo inválido" }).regex(/@uc\./, { message: "El correo debe ser UC" }),
    password: z
      .string()
      .min(1, { message: "Debes ingresar una contraseña!" })
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirm_password: z
      .string()
      .min(1, { message: "Debes confirmar tu contraseña!" })
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export type registerForm = z.infer<typeof registerSchema>;
