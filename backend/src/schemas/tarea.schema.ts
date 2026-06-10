import { z } from "zod";

export const tareaSchema = z.object({
  titulo: z.string().min(1, "campo vacio no valido"),
  prioridad: z.enum(["alta", "media", "baja"]).optional(),
  descripcion: z.string().optional(),
  fecha_limite: z.string().optional(),
});
