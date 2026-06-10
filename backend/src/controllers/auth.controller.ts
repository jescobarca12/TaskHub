import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { registrarUsuario, loginUsuario } from "../services/auth.service";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const usuario = await loginUsuario(email, password);

  if (!usuario) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  res.json({ token });
}

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  const usuario = await registrarUsuario(email, password);
  const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  res.status(201).json({ token });
}
