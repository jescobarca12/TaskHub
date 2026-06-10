import express from "express";
import authRoutes from "./routes/auth.routes";
import listasRoutes from "./routes/listas.routes";
import tareasRoutes from "./routes/tareas.routes";
import { errorHandler } from "./middlewares/error.middleware";
import cors from "cors";

const app = express();

// En producción, FRONTEND_URL será la URL del frontend desplegado (Vercel).
// En desarrollo, cae a localhost:5173.
const origenPermitido = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: origenPermitido }));

app.use(express.json()); // ← PRIMERO: prepara req.body para todos

app.use("/auth", authRoutes); // ← luego las rutas
app.use("/listas", listasRoutes);
app.use("/", tareasRoutes); // las rutas ya incluyen el path completo
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
