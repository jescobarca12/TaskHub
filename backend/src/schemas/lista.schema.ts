import { z } from "zod";

export const listaSchema = z.object({
  nombre: z.string().min(1, "campo vacio no valido"),
});
