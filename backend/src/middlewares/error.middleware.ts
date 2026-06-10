import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // si es un error nuestro (AppError), usa su statusCode
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  // si no, es un error inesperado → 500
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}
