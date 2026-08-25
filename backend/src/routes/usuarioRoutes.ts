import { Router } from "express";
import { login, atualizarIptu, novoLogin, getIptuPorIdUsuario, getQRCodeOrCodBarras, getIptus, ehAdmin } from "../controllers/usuarioController";

const router = Router();

router.post("/login", login);
router.post("/novo-login", novoLogin);
router.put("/atualizar-iptu",ehAdmin, atualizarIptu);
//interessante colocar na rota iptu por usuario um middleware para garantir que apenas usuario logado veja o proprio iptu
router.post("/iptu-por-usuario", getIptuPorIdUsuario);
router.get("/codigo-qr-ou-barra", getQRCodeOrCodBarras);
router.get("/iptus",ehAdmin, getIptus);

export default router;