import express from "express";
import authRoutes from "./routes/auth.routes";
import listasRoutes from "./routes/listas.routes";
import tareasRoutes from "./routes/tareas.routes";
import { errorHandler } from "./middlewares/error.middleware";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json()); // ← PRIMERO: prepara req.body para todos

app.use("/auth", authRoutes); // ← luego las rutas
app.use("/listas", listasRoutes);
app.use("/", tareasRoutes); // las rutas ya incluyen el path completo
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
