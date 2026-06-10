import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware";
import { crear,obtener,obtenerUna,actualizar,eliminar } from "../controllers/tareas.controller";
import { tareaSchema } from "../schemas/tarea.schema";
import { validar } from "../middlewares/validar.middleware";

const router = Router();
router.use(authRequired);
router.post("/listas/:listaId/tareas",validar(tareaSchema), crear);
router.get("/listas/:listaId/tareas", obtener);
router.get("/tareas/:id", obtenerUna);
router.patch("/tareas/:id", actualizar);
router.delete("/tareas/:id", eliminar);
export default router;