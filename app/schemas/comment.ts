import { z } from "zod";

export const commentSchema = z.object({
  comment: z.string().min(1, "El comentario es requerido").max(500, "El comentario es demasiado largo"),
  vote: z
    .enum(["positive", "negative"])
    .nullable()
    .refine((val) => val !== null, {
      message: "Debes seleccionar si el comentario fue útil o no",
    }),
});

export type CommentForm = z.infer<typeof commentSchema>;
