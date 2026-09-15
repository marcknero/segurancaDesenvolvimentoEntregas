import { Router } from "express";
import { login, atualizarIptu, payloadUsuario, novoLogin, getIptuPorIdUsuario, getQRCodeOrCodBarras, getIptus } from "../controllers/usuarioController";
import { generateCSRFToken } from "../middleware/generate_csrfTtoken";
import { verifyToken } from "../middleware/verify_csrfToken";
import { authJWT } from "../middleware/authJWT";

const router = Router();

router.post("/login", login);
router.post("/novo-login", novoLogin);
router.put("/atualizar-iptu",authJWT([1]), atualizarIptu);
//interessante colocar na rota iptu por usuario um middleware para garantir que apenas usuario logado veja o proprio iptu
router.get("/iptu-por-usuario",authJWT,getIptuPorIdUsuario);
router.get("/codigo-qr-ou-barra",authJWT, getQRCodeOrCodBarras);
router.get("/iptus",authJWT, getIptus);
router.get("/payload-usuario",generateCSRFToken,authJWT, payloadUsuario)

export default router;