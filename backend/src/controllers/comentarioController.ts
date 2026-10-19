
import { Request, Response } from "express";
import db from "../database";
import xss from "xss";


export const criarComentario = async (
    req: Request,
    res: Response
) => {

    // O texto vem do corpo da requisição e é higienizado antes de ser salvo.
    // O ID é obtido do payload autenticado para evitar que o cliente publique em nome de outro usuário.
    const { texto } = req.body;
    const usuarioId = res.locals.payload.id;

    // A função xss remove ou neutraliza marcações perigosas contra XSS armazenado.
    let textoLimpo = xss(texto);

    // Os valores são enviados separadamente no segundo argumento de db.query.
    // Os placeholders $1 e $2 evitam concatenar dados do usuário na SQL.
    const query =
        `INSERT INTO comentario (texto, usuario_id)
         VALUES ($1, $2)`;

    console.log(`Query Executada: ${query}`);


    try {

        await db.query(query, [textoLimpo, usuarioId]);

        res.status(201).json({
            message: "Comentário criado"
        });

    } catch (err: any) {

        res.status(500).json({
            error: err.message
        });
    }
};


export const listarComentarios = async (
    _req: Request,
    res: Response
) => {

    // Esta consulta não recebe valores externos; os comentários são retornados após
    // a autenticação e as regras de acesso definidas na rota.
    try {

        const result = await db.query(
            "SELECT * FROM comentario"
        );

        res.json(result.rows);

    } catch (err: any) {

        res.status(500).json({
            error: err.message
        });
    }
};
