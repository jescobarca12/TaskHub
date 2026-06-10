import { useState, useEffect } from "react";
import Login from "./Login";
import type { Lista, Tarea } from "./types";
import TareaItem from "./TareaItem";
import ListaItem from "./ListaItem";
import Registro from "./Registro";
function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [listas, setListas] = useState<Lista[]>([]); // estado para guardar los datos
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [listaSeleccionada, setListaSeleccionada] = useState<number | null>(
    null,
  );
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaPrioridad, setNuevaPrioridad] = useState("media");
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [filtro, setFiltro] = useState(""); // "" = todas
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  function manejarLogin(nuevoToken: string) {
    setToken(nuevoToken); // guardar en estado
    localStorage.setItem("token", nuevoToken); // persistir
  }
  function cerrarSesion() {
    setToken(null); // estado → null → muestra login
    localStorage.removeItem("token"); // borra el token persistido
  }
  async function crearLista(e: React.FormEvent) {
    e.preventDefault(); // no recargar
    const res = await fetch("http://localhost:3000/listas", {
      method: "POST", // ← método POST
      headers: {
        "Content-Type": "application/json", // ← avisar que mandamos JSON
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ nombre: nuevoNombre }), // ← el body como string JSON
    });
    const nuevaLista = await res.json(); // la lista creada que devuelve el backend
    setListas([...listas, nuevaLista]); // agregar al estado (inmutable)
    setNuevoNombre(""); // limpiar el input
  }
  async function crearTarea(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:3000/listas/${listaSeleccionada}/tareas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ← avisar que mandamos JSON
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          titulo: nuevoTitulo,
          prioridad: nuevaPrioridad,
        }),
      },
    );
    const nuevaTarea = await res.json();
    setTareas([...tareas, nuevaTarea]);
    setNuevoTitulo("");
  }
  async function alternarCompletada(tarea: Tarea) {
    const res = await fetch(`http://localhost:3000/tareas/${tarea.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ completada: !tarea.completada }),
    });
    const actualizada = await res.json();
    setTareas(tareas.map((t) => (t.id === tarea.id ? actualizada : t)));
  }
  async function borrarTarea(tareaId: number) {
    await fetch(`http://localhost:3000/tareas/${tareaId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    setTareas(tareas.filter((t) => t.id !== tareaId));
  }
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/listas", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (res.status === 401) {
          // token inválido o expirado
          cerrarSesion(); // borra token → vuelve al login
          return null; // corta aquí
        }
        return res.json();
      })
      .then((data) => {
        if (data) setListas(data); // solo si hubo datos
      });
  }, [token]);
  useEffect(() => {
    if (!listaSeleccionada || !token) return;
    // construir la URL con el filtro
    let url = `http://localhost:3000/listas/${listaSeleccionada}/tareas`;
    if (filtro) url += filtro; // ej: "?prioridad=alta"
    fetch(url, { headers: { Authorization: "Bearer " + token } })
      .then((res) => res.json())
      .then((data) => setTareas(data));
  }, [listaSeleccionada, token, filtro]); // ← filtro añadido a deps

  if (!token) {
    return mostrarRegistro ? (
      <Registro
        onLogin={manejarLogin}
        onCambiar={() => setMostrarRegistro(false)}
      />
    ) : (
      <Login
        onLogin={manejarLogin}
        onCambiar={() => setMostrarRegistro(true)}
      />
    );
  }
  return (
    <div>
      <header className="app-header">
        <h1>TaskHub</h1>
        <button className="btn btn-secundario" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <h2>Mis listas</h2>
          <form className="form-crear" onSubmit={crearLista}>
            <input
              className="input"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Nueva lista"
            />
            <button className="btn btn-primario" type="submit">
              +
            </button>
          </form>
          {listas.length === 0 ? (
            <p className="vacio">No tienes listas todavía</p>
          ) : (
            <ul className="lista-ul">
              {listas.map((lista) => (
                <ListaItem
                  key={lista.id}
                  lista={lista}
                  seleccionada={listaSeleccionada === lista.id}
                  onSelect={setListaSeleccionada}
                />
              ))}
            </ul>
          )}
        </aside>

        <main className="main">
          {listaSeleccionada ? (
            <div>
              <form className="form-crear-tarea" onSubmit={crearTarea}>
                <input
                  className="input"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  placeholder="Nueva tarea"
                />
                <select
                  className="select"
                  value={nuevaPrioridad}
                  onChange={(e) => setNuevaPrioridad(e.target.value)}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
                <button className="btn btn-primario" type="submit">
                  Crear tarea
                </button>
              </form>
              <h3>Tareas</h3>
              <div className="filtros">
                <button className="btn-filtro" onClick={() => setFiltro("")}>
                  Todas
                </button>
                <button
                  className="btn-filtro"
                  onClick={() => setFiltro("?estado=pendiente")}
                >
                  Pendientes
                </button>
                <button
                  className="btn-filtro"
                  onClick={() => setFiltro("?prioridad=alta")}
                >
                  Prioridad alta
                </button>
                <button
                  className="btn-filtro"
                  onClick={() => setFiltro("?vencidas=true")}
                >
                  Vencidas
                </button>
              </div>
              <ul className="tarea-ul">
                {tareas.map((tarea) => (
                  <TareaItem
                    key={tarea.id}
                    tarea={tarea}
                    onToggle={alternarCompletada}
                    onDelete={borrarTarea}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <p className="vacio">Selecciona una lista para ver sus tareas</p>
          )}
        </main>
      </div>
    </div>
  );
}
export default App;
