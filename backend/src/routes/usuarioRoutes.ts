import { Router } from "express";
import { login, atualizarIptu, novoLogin, getIptuPorIdUsuario, getQRCodeOrCodBarras, getIptus } from "../controllers/usuarioController";

const router = Router();

router.post("/login", login);
router.post("/novo-login", novoLogin);
router.put("/atualizar-iptu", atualizarIptu);
router.post("/iptu-por-usuario", getIptuPorIdUsuario);
router.get("/codigo-qr-ou-barra", getQRCodeOrCodBarras);
router.get("/iptus", getIptus);

export default router;