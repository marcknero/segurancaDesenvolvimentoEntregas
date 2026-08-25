import { NextFunction, Request, Response } from "express";
import db from "../database";
import jwt from 'jsonwebtoken';

const JWT_SEGREDO = process.env.JWT_SEGREDO || 'Tnlmaslkcalsdfkalj0129iT'; 

export interface AuthRequest extends Request {
    usuario?: any;
}

export const ehAdmin = (req:AuthRequest, res:Response,next:NextFunction)=>{
    //pega o token do header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return res.status(401).json({
            success: false,
            message: "token não fornecido"
        });
    }

    try{
        //valida o token
        const payload = jwt.verify(token, JWT_SEGREDO) as any;

        //verifica se é admin
        if (payload.tipo !== "admin"){
            return res.status(403).json({
                sucess:false,
                message: "Acesso Negado. Usuário não é administrador"
            });
    
        }

        req.usuario = payload;

        return next();
    } catch (error){
        return res.status(401).json({
            success: false,
            message: "Token inválido ou expirado"
        });
    }

};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const query =
        `SELECT * FROM usuario WHERE email = $1 AND senha = $2`;

    console.log(`Query Executada: ${query}`);

    const result = await db.query(query,[email,password]);

    if (result.rowCount && result.rowCount > 0) {
        
        const usuario = result.rows[0]

        // 1. Defina os dados que vão dentro do token
        const payload = {
            id: usuario.id,
            email: usuario.email,
            tipo: usuario.tipo_usuario_id === 1 ? "admin" : "comum"
        };

        // 2. GERAÇÃO DO TOKEN TEMPORÁRIO (Expira em 1 hora, por exemplo)
        const token = jwt.sign(payload, JWT_SEGREDO, { expiresIn: '1h' });

        // 3. Retorna o token junto com o usuário
        return res.json({
            success: true,
            token, // <--- O token temporário vai aqui
            user: usuario
        });

    } else {
        res.status(401).json({
            success: false,
            message: "Falha no login"
        });
    }
};


export const novoLogin = async (req: Request, res: Response) => {
    const { email, password, nome } = req.body;

    const queryNomeIpuExiste =
        `SELECT * FROM iptu WHERE nome = $1`;

    console.log(`Query Executada: ${queryNomeIpuExiste}`);

    const iptuResult = await db.query(queryNomeIpuExiste,[nome]);

    if (iptuResult.rowCount && iptuResult.rowCount > 0) {

        const query =
            `INSERT INTO usuario (email, senha, nome, tipo_usuario_id)
             VALUES ($1,$2, $3, 3)`;

        console.log(`Query Executada: ${query}`);

        const result = await db.query(query,[email, password, nome]);

        const queryIdUsuario =
            `SELECT * FROM usuario
             WHERE email = $1 AND senha = $2`;

        console.log(`Query Executada: ${queryIdUsuario}`);

        const resultIdUsuario = await db.query(queryIdUsuario, [email, password]);
        
        // Definimos a constante aqui para usarmos abaixo sem erros
        const usuarioCriado = resultIdUsuario.rows[0];

        const queryUpdateTabelaIptu =
            `UPDATE iptu
             SET usuario_id = $1
             WHERE nome = $2`;

        console.log(`Query Executada: ${queryUpdateTabelaIptu}`);

        const resultUpdate = await db.query(queryUpdateTabelaIptu, [usuarioCriado.id, nome]);

        if (
            result.rowCount &&
            result.rowCount > 0 &&
            resultUpdate.rowCount &&
            resultUpdate.rowCount > 0
        ) {

            // 1. Dados para o token do novo usuário
            const payload = {
                id: usuarioCriado.id,
                email: usuarioCriado.email,
                tipo: "comum"
            };
        
            // 2. GERAÇÃO DO TOKEN TEMPORÁRIO (Expira em 1 hora)
            const token = jwt.sign(payload, JWT_SEGREDO, { expiresIn: '1h' });

            return res.json({
                success: true,
                token, // <--- Token temporário gerado no cadastro
                user: usuarioCriado
            });

        } else {
            return res.status(401).json({
                success: false,
                message: "Falha no cadastro"
            });
        }

    } else {
        return res.status(404).json({
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

    const query =
        `UPDATE iptu
         SET valor = $1
         WHERE usuario_id = $2`;

    console.log(`Query Executada: ${query}`);

    try {
        await db.query(query, [novoValor, usuarioId]);

        res.json({
            message: "IPTU atualizado"
        });

    } catch (err: any) {
        res.status(500).json({
            error: err.message
        });
    }
};


export const getIptuPorIdUsuario = async (
    req: Request,
    res: Response
) => {

    const {
        usuarioId,
    } = req.body;
    const query =
        `SELECT * FROM iptu WHERE usuario_id = $1`;

    console.log(`Query Executada: ${query}`);

    try {

        const result = await db.query(query, [usuarioId]);

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
    }
};


export const getQRCodeOrCodBarras = async (
    req: Request,
    res: Response
) => {

    let tipo = req.query.tipo as string;


    let codigoHtml = "";

    if (tipo === "codigoDeBarras") {

        codigoHtml =
            `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=123456789" />`;

    } else if (tipo === "qrcode") {

        codigoHtml =
            `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QRCodeDemo" />`;
    } else {
        tipo = "invalido";
        codigoHtml=``;

    }

    res.send(`
        <h2>Tipo selecionado: ${tipo}</h2>
        ${codigoHtml}
    `);
};

