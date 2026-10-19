import { Router } from "express";
import { criarComentario, listarComentarios } from "../controllers/comentarioController";
import { authMiddleware } from "../middleware/authMiddleware";
import { csrfTokenMiddleware } from "../middleware/csrfTokenMiddleware";

const router = Router();

// A intenção é exigir autenticação e validação CSRF antes de chegar ao controller.
// authMiddleware é uma fábrica e deve ser chamada com os perfis permitidos.
router.post("/", authMiddleware([]), csrfTokenMiddleware, criarComentario);

// A listagem é somente leitura, mas continua restrita a usuários autenticados.
router.get("/", authMiddleware([]), listarComentarios);

export default router;