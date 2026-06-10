import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware";
import {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar,
} from "../controllers/listas.controller";
import { validar } from "../middlewares/validar.middleware";
import { listaSchema } from "../schemas/lista.schema";

const router = Router();
router.use(authRequired);
router.post("/", validar(listaSchema), crear);
router.get("/", listar);
router.get("/:id", obtener);
router.patch("/:id", actualizar);
router.delete("/:id", eliminar);
export default router;
