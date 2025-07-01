import generarToken from "../utils/jwt.js"
import { Request, Response, NextFunction } from "express";
import AppError  from "../utils/appError.js";
import { IUserInRequest } from "../types/usuario.js";
export const postLogin = async  (req: Request, res: Response, next: NextFunction)=> {
    try {
        const usuario = req.user;
        const token = generarToken(usuario as IUserInRequest);        
        res.status(200).json({ token: token })
    } catch (error) {
        next(new AppError('Error al obtener el token', 500));
    }
}