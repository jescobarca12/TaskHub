import { Router } from "express";
import { register,login } from "../controllers/auth.controller";
import { authRequired } from "../middlewares/auth.middleware";

const router = Router();
router.get("/me", authRequired, (req, res) => {
  res.json({ usuarioId: req.user!.id });
});
router.post("/register", register);
router.post("/login", login);
export default router;