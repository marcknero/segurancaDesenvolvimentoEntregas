import express from "express";
import userRoutes from "./routes/usuarioRoutes";
import commentRoutes from "./routes/comentarioRoutes";
import hackerMalvadao from "./routes/hackerMalvadaoRoutes";

const app = express();

(global as any).segredo.Jwt='seu token aqui'

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/usuario", userRoutes);
app.use("/hacker-malvadao", hackerMalvadao);
app.use("/comentario", commentRoutes);

app.listen(3001, () => {
    console.log("Servidor Vulnerável rodando na porta 3001");
});