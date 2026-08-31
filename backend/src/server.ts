import express from "express";
import userRoutes from "./routes/usuarioRoutes";
import commentRoutes from "./routes/comentarioRoutes";
import hackerMalvadao from "./routes/hackerMalvadaoRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const cookiesParser = require("cookie-parser");
app.use(cookiesParser());

(global as any).segredoJwt = "Tnlmaslkcalsdfkalj0129iT";
app.use("/usuario", userRoutes);
app.use("/comentario", commentRoutes);
app.use("/hacker-malvadao", hackerMalvadao);

app.listen(3001, () => {
    console.log("Servidor Vulnerável rodando na porta 3001");
});