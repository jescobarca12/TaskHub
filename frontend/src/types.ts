export interface Lista {
  id: number;
  nombre: string;
}

export interface Tarea {
  id: number;
  titulo: string;
  prioridad: string;
  completada: boolean;
  fecha_limite: string | null;
}