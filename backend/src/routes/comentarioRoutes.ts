import { Router } from "express";
import { criarComentario, listarComentarios } from "../controllers/comentarioController";
import { verifyToken } from "../middleware/verify_csrfToken";
import { authJWT } from "../middleware/authJWT";

const router = Router();

router.post("/",verifyToken, authJWT, criarComentario);
router.get("/",authJWT, listarComentarios);

export default router;