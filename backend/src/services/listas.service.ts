import pool from "../db";
import { NotFoundError } from "../errors/errors";

export async function crearLista(usuarioId: number, nombre: string) {
  const result = await pool.query(
    `INSERT INTO listas (nombre, usuario_id)
     VALUES ($1, $2)
     RETURNING id, nombre, usuario_id, created_at`,
    [nombre, usuarioId]
  );
  return result.rows[0];
}
export async function listarListas(usuarioId: number) {
  const result = await pool.query(
    "SELECT id, nombre, created_at FROM listas WHERE usuario_id = $1 ORDER BY created_at DESC",
    [usuarioId]
  );
  return result.rows;
}

export async function obtenerLista(usuarioId: number, listaId: number) {
  const result = await pool.query(
    "SELECT id, nombre, created_at FROM listas WHERE id = $1 AND usuario_id = $2",
    [listaId, usuarioId]
  );
  if (result.rows.length === 0) throw new NotFoundError("Lista no encontrada");
  return result.rows[0];   // undefined si no existe o no es suya
}
export async function actualizarLista(usuarioId: number, listaId: number, nombre: string) {
  const result = await pool.query(
    `UPDATE listas SET nombre = $1
     WHERE id = $2 AND usuario_id = $3
     RETURNING id, nombre, created_at`,
    [nombre, listaId, usuarioId]
  );
  if (result.rows.length === 0) throw new NotFoundError("Lista no encontrada");
  return result.rows[0];   // undefined si no existe / no es suya
}

export async function eliminarLista(usuarioId: number, listaId: number) {
  const result = await pool.query(
    "DELETE FROM listas WHERE id = $1 AND usuario_id = $2",
    [listaId, usuarioId]
  );
  if (result.rowCount === 0) throw new NotFoundError("Lista no encontrada");
  return result.rowCount;  // 0 si no borró nada
}