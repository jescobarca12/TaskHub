import { Request, Response } from "express";
import {
  crearTarea,
  obtenerTareas,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
} from "../services/tareas.service";

export async function crear(req: Request, res: Response) {
  const usuarioId = req.user!.id;
  const listaId = Number(req.params.listaId);
  const tarea = await crearTarea(usuarioId, listaId, req.body);
  res.status(201).json(tarea);
}
export async function obtener(req: Request, res: Response) {
  const prioridad = (req.query.prioridad as string) || undefined;
  const estado = (req.query.estado as string) || undefined;
  const vencidas = (req.query.vencidas as string) || undefined;
  const tareas = await obtenerTareas(
    req.user!.id,
    Number(req.params.listaId),
    prioridad,
    estado,
    vencidas,
  );
  res.json(tareas);
}
export async function obtenerUna(req: Request, res: Response) {
  const tarea = await obtenerTarea(req.user!.id, Number(req.params.id));
  res.json(tarea);
}
export async function actualizar(req: Request, res: Response) {
  const tarea = await actualizarTarea(
    req.user!.id,
    Number(req.params.id),
    req.body,
  );
  res.json(tarea);
}

export async function eliminar(req: Request, res: Response) {
  const filas = await eliminarTarea(req.user!.id, Number(req.params.id));
  res.status(204).send();
}
