import { Router } from "express";
import { recepcionarDadosRoubados } from "../controllers/hackerMalvadaoController";

const router = Router();

// Esta rota não possui autenticação ou CSRF; ela representa o endpoint vulnerável do exercício.
router.post("/dados-roubados", recepcionarDadosRoubados);

export default router;