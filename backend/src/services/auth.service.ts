import pool from "../db";
import bcrypt from "bcrypt";
import { ConflictError } from "../errors/errors";

export async function registrarUsuario(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      `INSERT INTO usuarios (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [email, passwordHash]
    );
    return result.rows[0];
  } catch (err: any) {
    if (err.code === "23505") {                          // unique_violation
      throw new ConflictError("El email ya está registrado");
    }
    throw err;   // cualquier otro error → que suba al handler como 500
  }
}
export async function loginUsuario(email: string, password: string) {
  const result = await pool.query(
    "SELECT id, email, password_hash FROM usuarios WHERE email = $1",
    [email]
  );
  const usuario = result.rows[0];
  if (!usuario) return null;                         // email no existe

  const coincide = await bcrypt.compare(password, usuario.password_hash);
  if (!coincide) return null;                        // password incorrecta

  return usuario;                                    // credenciales válidas
}