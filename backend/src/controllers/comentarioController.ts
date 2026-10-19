
import { Request, Response } from "express";
import db from "../database";
import xss from "xss";


export const criarComentario = async (
    req: Request,
    res: Response
) => {

    const {
        texto,
        usuarioId
    } = req.body;
    let textoLimpo = xss(texto);
    const query =
        `INSERT INTO comentario (texto, usuario_id)
         VALUES ($1, $2)`;

    console.log(`Query Executada: ${query}`);


    try {

        await db.query(query, [texto, usuarioId]);

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
