import express from "express";
import userRoutes from "./routes/usuarioRoutes";
import commentRoutes from "./routes/comentarioRoutes";
import hackerMalvadao from "./routes/hackerMalvadaoRoutes";

const app = express();

// Os parsers transformam o corpo recebido em dados acessíveis aos controllers.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const cookiesParser = require("cookie-parser");
// O cookie-parser permite que os middlewares leiam JWT e token CSRF dos cookies.
app.use(cookiesParser());

// O segredo é usado para assinar e validar os tokens JWT de autenticação.
(global as any).segredoJwt = "Tnlmaslkcalsdfkalj0129iT";
app.use("/usuario", userRoutes);
app.use("/comentario", commentRoutes);
app.use("/hacker-malvadao", hackerMalvadao);

app.listen(3001, () => {
    console.log("Servidor Vulnerável rodando na porta 3001");
});
