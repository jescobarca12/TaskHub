import { Request, Response } from "express";
import { crearLista,listarListas,obtenerLista,eliminarLista,actualizarLista} from "../services/listas.service";

export async function crear(req: Request, res: Response) {
  const usuarioId = req.user!.id;   // ← del token, no del body
  const { nombre } = req.body;       // ← del body, solo el nombre
  const lista = await crearLista(usuarioId, nombre);
  res.status(201).json(lista);
}
export async function listar(req: Request, res: Response) {
  const listas = await listarListas(req.user!.id);
  res.json(listas);   // 200 con array (puede ser [])
}

export async function obtener(req: Request, res: Response) {
  const lista = await obtenerLista(req.user!.id, Number(req.params.id));
  
  res.json(lista);
}
export async function actualizar(req: Request, res: Response) {
  const { nombre } = req.body;
  const lista = await actualizarLista(req.user!.id, Number(req.params.id), nombre);
  
  res.json(lista);
}

export async function eliminar(req: Request, res: Response) {
  const filas = await eliminarLista(req.user!.id, Number(req.params.id));
 
  res.status(204).send();
}