import pool from "../db";
import { NotFoundError } from "../errors/errors";
interface DatosTarea {
  titulo: string;
  descripcion?: string;
  prioridad?: string;
  fecha_limite?: string;
}

export async function crearTarea(
  usuarioId: number,
  listaId: number,
  datos: DatosTarea,
) {
  // 1. verificar que la lista sea del usuario
  const lista = await pool.query(
    "SELECT id FROM listas WHERE id = $1 AND usuario_id = $2",
    [listaId, usuarioId],
  );
  if (lista.rows.length === 0) throw new NotFoundError("Lista no encontrada"); // lista no existe o no es suya

  // 2. insertar la tarea
  const result = await pool.query(
    `INSERT INTO tareas (lista_id, titulo, descripcion, prioridad, fecha_limite)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      listaId,
      datos.titulo,
      datos.descripcion ?? null,
      datos.prioridad ?? "media",
      datos.fecha_limite ?? null,
    ],
  );
  return result.rows[0];
}
export async function obtenerTareas(
  usuarioId: number,
  listaId: number,
  prioridad?: string,
  estado?: string,
  vencidas?: string,
) {
  // 1. verificar que la lista sea del usuario
  const lista = await pool.query(
    "SELECT id FROM listas WHERE id = $1 AND usuario_id = $2",
    [listaId, usuarioId],
  );
  if (lista.rows.length === 0) throw new NotFoundError("Lista no encontrada"); // lista no existe / no es suya → 404
  const condiciones: string[] = ["lista_id = $1"]; // condición base (siempre)
  const valores: any[] = [listaId];
  if (prioridad) {
    // solo si viene el filtro
    valores.push(prioridad); // agrego el valor
    condiciones.push(`prioridad = $${valores.length}`); // agrego la condición con su $N
  }
  if (estado) {
    valores.push(estado === "completada"); // agrego el valor
    condiciones.push(`completada = $${valores.length}`); // agrego la condición con su $N
  }
  if (vencidas === "true") {
    condiciones.push(`fecha_limite < NOW() AND completada = false`); // filtro vencidas: condición fija, sin parámetro.
  }
  // 2. listar las tareas de esa lista (sin JOIN → sin colisión)
  const result = await pool.query(
    `SELECT * FROM tareas WHERE ${condiciones.join(" AND ")} ORDER BY created_at DESC`,
    valores,
  );
  return result.rows;
}
export async function obtenerTarea(usuarioId: number, tareaId: number) {
  const result = await pool.query(
    `SELECT t.* FROM tareas t
     JOIN listas l ON l.id = t.lista_id
     WHERE t.id = $1 AND l.usuario_id = $2`,
    [tareaId, usuarioId],
  );
  if (result.rows.length === 0) throw new NotFoundError("tarea no encontrada"); //404 si no existe o no es del usuario
  return result.rows[0];
}
export async function actualizarTarea(
  usuarioId: number,
  tareaId: number,
  datos: Partial<DatosTarea> & { completada?: boolean },
) {
  // 1. verificar propiedad (reutiliza obtenerTarea)
  const tarea = await obtenerTarea(usuarioId, tareaId);
  // 2. update parcial con COALESCE
  const result = await pool.query(
    `UPDATE tareas SET
       titulo = COALESCE($1, titulo),
       descripcion = COALESCE($2, descripcion),
       prioridad = COALESCE($3, prioridad),
       fecha_limite = COALESCE($4, fecha_limite),
       completada = COALESCE($5, completada)
     WHERE id = $6
     RETURNING *`,
    [
      datos.titulo ?? null,
      datos.descripcion ?? null,
      datos.prioridad ?? null,
      datos.fecha_limite ?? null,
      datos.completada ?? null,
      tareaId,
    ],
  );
  return result.rows[0];
}

export async function eliminarTarea(usuarioId: number, tareaId: number) {
  const tarea = await obtenerTarea(usuarioId, tareaId);
  const result = await pool.query("DELETE FROM tareas WHERE id = $1", [
    tareaId,
  ]);
  return result.rowCount;
}
