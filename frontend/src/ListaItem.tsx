import type { Lista } from "./types";

interface Props {
  lista: Lista;
  seleccionada: boolean;
  onSelect: (id: number) => void;
}

function ListaItem({ lista, seleccionada, onSelect }: Props) {
  return (
    <li
      className={"lista-item" + (seleccionada ? " activa" : "")}
      onClick={() => onSelect(lista.id)}
    >
      {lista.nombre}
    </li>
  );
}

export default ListaItem;