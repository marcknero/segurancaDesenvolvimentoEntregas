import { Router } from "express";
import { login, atualizarIptu, payloadUsuario, novoLogin, getIptuPorIdUsuario, getQRCodeOrCodBarras, getIptus } from "../controllers/usuarioController";

const router = Router();

router.post("/login", login);
router.post("/novo-login", novoLogin);
router.put("/atualizar-iptu", atualizarIptu);
//interessante colocar na rota iptu por usuario um middleware para garantir que apenas usuario logado veja o proprio iptu
router.get("/iptu-por-usuario",getIptuPorIdUsuario);
router.get("/codigo-qr-ou-barra", getQRCodeOrCodBarras);
router.get("/iptus", getIptus);
router.get("/payload-usuario",payloadUsuario)

export default router;