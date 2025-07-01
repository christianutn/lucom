// backend\src\utils\autorizar.ts
import AppError from "./appError.js";
import { Request, Response, NextFunction } from "express";
import { IUserInRequest } from "../types/usuario.js";

const autorizar = (listaDeRolesAceptados: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Gracias a la declaración global, TypeScript ya sabe que req.user tiene 'rol'
            if (!req.user|| !req.user.rol) {
                return next(new AppError("Usuario no autorizado", 401));
            }

            // Verifica si el rol del usuario está en la lista de roles aceptados
            const esAutorizado = listaDeRolesAceptados.includes(req.user.rol);

            if (!esAutorizado) {
                return next(new AppError("Usuario no autorizado", 403));
            }

            next();
        } catch (error) {
            next(new AppError("Error de autorización", 500));
        }
    };
};

export default autorizar;
