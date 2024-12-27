import { coerce, z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }).regex(/@uc\./, { message: "El correo debe ser UC" }),
  password: z.string(),
});

export type loginForm = z.infer<typeof loginSchema>;
