import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

function Login({
  onLogin,
  onCambiar,
}: {
  onLogin: (token: string) => void;
  onCambiar: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function manejarLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); // limpiar error previo
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      // status no es 2xx (ej. 401)
      setError("Credenciales inválidas");
      return; // cortar, no seguir
    }
    const data = await res.json();
    onLogin(data.token);
  }

  return (
    <div className="auth-contenedor">
      <form className="auth-card" onSubmit={manejarLogin}>
        <h2>Iniciar sesión</h2>
        {error && <p className="auth-error">{error}</p>}
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Contraseña"
        />
        <button className="btn btn-primario" type="submit">
          Entrar
        </button>
        <button className="btn btn-secundario" type="button" onClick={onCambiar}>
          ¿No tienes cuenta? Regístrate
        </button>
      </form>
    </div>
  );
}

export default Login;
