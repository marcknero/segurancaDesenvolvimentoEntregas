import jwt from "jsonwebtoken";
import { RetornoPayload } from "../Tipos/retornoPayload";

export default function ValidarToken(token: string): RetornoPayload | null {
    try {

        // jwt.verify valida a assinatura e impede o uso de tokens alterados pelo cliente.
        const decoded = jwt.verify(token, (global as any).segredoJwt) as RetornoPayload;

        // Somente os campos necessários para autorização são repassados à aplicação.
        return {
            id: decoded.id,
            tipo: decoded.tipo,
            email: decoded.email,
            nome: decoded.nome
        };
    } catch (error) {
        // Token ausente, expirado ou adulterado não pode autorizar a requisição.
        console.error("Erro ao validar o token:", error);
        return null;
    }
}

