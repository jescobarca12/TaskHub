import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validar(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: resultado.error.issues,
      });
    }
    req.body = resultado.data;   // reemplaza con los datos validados/limpios
    next();
  };
}