import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // 1. ¿viene el header con formato "Bearer <token>"?
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autenticado" });
  }

  // 2. extraer el token (quitar "Bearer ")
  const token = authHeader.split(" ")[1];

  // 3. verificar el token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.user = { id: payload.userId };   // guardamos el usuario en el request
    next();                              // todo bien → continuar al controller
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}