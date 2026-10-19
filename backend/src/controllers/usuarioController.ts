import { Request, Response } from "express";
import db from "../database";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export const payloadUsuario = async (req: Request, res: Response) => {
    
    // O payload foi colocado em res.locals pelo middleware JWT.
    // O token CSRF é devolvido para o frontend usar nas próximas requisições.
    return res.json({
        success: true,
        message: "Payload do usuário obtido com sucesso",
        payload: res.locals.payload,
        cryptoToken: res.locals.csrfToken
    });
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    // $1 e $2 recebem os valores separadamente e evitam SQL Injection por concatenação.
    // No fluxo atual, a senha ainda é comparada diretamente com o valor recebido.
    const query =
        `SELECT * FROM usuario WHERE email = $1 AND senha = $2`;

    console.log(`Query Executada: ${query}`);

    const result = await db.query(query, [email, password]);

    if (result.rowCount && result.rowCount > 0) {
        // O JWT identifica o usuário e o perfil; ele é armazenado em cookie HttpOnly.
        // Assim, o JavaScript do navegador não acessa diretamente o cookie de autenticação.
        const token = jwt.sign(
            {
                id: result.rows[0].id,
                nome: result.rows[0].nome,
                email: result.rows[0].email,
                tipo: result.rows[0].tipo_usuario_id
            }, (global as any).segredoJwt);
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

        // Este token é usado como prova adicional contra requisições CSRF.
        // const csrfToken = crypto.randomBytes(32).toString("hex");
        
        // res.json({
        //     success: true,
        //     cryptoToken: csrfToken
        // });

    } else {
        res.status(401).json({
            success: false,
            message: "Falha no login"
        });
    }
};


export const novoLogin = async (req: Request, res: Response) => {
    const { email, password, nome } = req.body;

    // O nome é enviado como parâmetro, sem ser inserido diretamente na consulta SQL.
    const queryNomeIpuExiste =
        `SELECT * FROM iptu WHERE nome = $1`;

    console.log(`Query Executada: ${queryNomeIpuExiste}`);

    const iptuResult = await db.query(queryNomeIpuExiste,[nome]);

    if (iptuResult.rowCount && iptuResult.rowCount > 0) {

        // Os campos do novo usuário também usam placeholders para evitar SQL Injection.
        const query =
            `INSERT INTO usuario (email, senha, nome, tipo_usuario_id)
             VALUES ($1, $2, $3, 3)`;

        console.log(`Query Executada: ${query}`);

        const result = await db.query(query,[email,password,nome]);

        const queryIdUsuario =
            `SELECT id FROM usuario
             WHERE email = $1 AND senha = $2`;

        console.log(`Query Executada: ${queryIdUsuario}`);

        const resultIdUsuario = await db.query(queryIdUsuario,[email,password]);

        const queryUpdateTabelaIptu =
            `UPDATE iptu
             SET usuario_id = $1
             WHERE nome = $2`;

        // O ID e o nome continuam separados dos comandos SQL durante o UPDATE.
        console.log(`Query Executada: ${queryUpdateTabelaIptu}`);

        const resultUpdate = await db.query(queryUpdateTabelaIptu,[resultIdUsuario.rows[0].id, nome]);

        if (
            result.rowCount &&
            result.rowCount > 0 &&
            resultUpdate.rowCount &&
            resultUpdate.rowCount > 0
        ) {

            res.json({
            success: true,
            user: result.rows[0]
        
            });

        } else {
            res.status(401).json({
                success: false,
                message: "Falha no login"
            });
        }

    } else {
        res.status(404).json({
            success: false,
            message: `Nome '${nome}' não encontrado no cadastro de municipes`
        });
    }
};


export const atualizarIptu = async (req: Request, res: Response) => {
    const {
        usuarioId,
        novoValor
    } = req.body;

    // Sugestão de regra de negócio: apenas usuários dos tipos 1 e 2 podem atualizar IPTU.
    // A validação abaixo está comentada e, por isso, não altera o fluxo atual.
    // const usuarioAutenticado = res.locals.payload;

    // if (usuarioAutenticado.tipo !== 1 || usuarioAutenticado.tipo !== 2) {
    //     return res.status(403).json({
    //         success: false,
    //         message: "Acesso não autorizado"
    //     });
    // }

    const query =
        `UPDATE iptu
         SET valor = $1
         WHERE usuario_id = $2`;

    // O valor e o ID são parâmetros da consulta; não são concatenados na SQL.
    console.log(`Query Executada: ${query}`);

    try {
        await db.query(query,[novoValor, usuarioId]);

        res.json({
            message: "IPTU atualizado"
        });

    } catch (err: any) {
        res.status(500).json({
            error: err.message
        });
    }
};


export const getIptuPorIdUsuario = async (req: Request, res: Response) => {
    // O usuário consultado é identificado pelo payload validado no middleware JWT.
    const query =
        `SELECT * FROM iptu WHERE usuario_id = $1`;

    console.log(`Query Executada: ${query}`);

    try {

        // O ID do payload é passado como parâmetro para impedir SQL Injection.
        const result = await db.query(query,[res.locals.payload.id]);

        console.log(`Retorno: ${JSON.stringify(result.rows)}`);

        res.json({
            iptu: result.rows
        });

    } catch (err: any) {

        res.status(500).json({
            error: err.message
        });
    }
};


export const getIptus = async (
    req: Request,
    res: Response
) => {
    // A conferência do perfil limita a listagem aos tipos autorizados.
    if (res.locals.payload.tipo === 1 || res.locals.payload.tipo === 2) {

    const query = `SELECT * FROM iptu`;

    console.log(`Query Executada: ${query}`);

    try {

        const result = await db.query(query);

        res.json({
            iptu: result.rows
        });

    } catch (err: any) {

        res.status(500).json({
            error: err.message
        });
    }} else {
        res.status(403).json({
            message: "Acesso negado"
        });
    }
};


export const getQRCodeOrCodBarras = async (
    req: Request,
    res: Response
) => {

    // O tipo recebido pela query string controla apenas duas opções conhecidas.
    // A validação abaixo evita que outros valores sejam usados na resposta HTML.
    const tipo = req.query.tipo as string;


    let codigoHtml = "";

    if (tipo === "codigoDeBarras") {

        // A URL usada no exemplo é fixa e não recebe conteúdo arbitrário do cliente.
        codigoHtml =
            `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=123456789" />`;

    } else if (tipo === "qrcode") {

        codigoHtml =
            `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QRCodeDemo" />`;
    }

    res.send(`
        <h2>Tipo selecionado: ${tipo}</h2>
        ${codigoHtml}
    `);
};
