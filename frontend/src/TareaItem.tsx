import type { Tarea } from "./types";

interface Props {
  tarea: Tarea;
  onToggle: (tarea: Tarea) => void;
  onDelete: (id: number) => void;
}

function TareaItem({ tarea, onToggle, onDelete }: Props) {
  return (
    <li className="tarea-item">
      <input
        className="tarea-checkbox"
        type="checkbox"
        checked={tarea.completada}
        onChange={() => onToggle(tarea)}
      />
      <span className={"tarea-texto" + (tarea.completada ? " completada" : "")}>
        {tarea.titulo}
      </span>
      <span className={"prioridad-badge prioridad-" + tarea.prioridad}>
        {tarea.prioridad}
      </span>
      <button className="btn-peligro" onClick={() => onDelete(tarea.id)}>
        Borrar
      </button>
    </li>
  );
}

export default TareaItem;