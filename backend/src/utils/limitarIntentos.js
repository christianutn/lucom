import { rateLimit } from "express-rate-limit";
import AppError from "./appError.js";

const limitarIntentos = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 5, // Limita a 3 intentos por IP por 'windowMs'
    message: "Demasiados intentos de inicio de sesión, por favor intenta nuevamente más tarde.",
    headers: true,
    handler: (req, res, next) => {
        
        // Personaliza la respuesta cuando el límite es alcanzado
        next(new AppError("Demasiados intentos de inicio de sesión, por favor intenta nuevamente más tarde.", 429)); // Pasa el error al middleware de manejo de errores
    }
});

export default limitarIntentos;