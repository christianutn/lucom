import 'dotenv/config'
import jwt from 'jsonwebtoken'
import AppError from './appError.js'
import { IUserInRequest } from '../types/usuario.d.js'

const generarToken = (usuario: IUserInRequest): string => {
    if (!process.env.JWT_SECRET) {
        throw new AppError('Falta la variable de entorno JWT_SECRET', 500);
    }
    try {
        // --- CAMBIO CLAVE: CREAR UN PAYLOAD MÍNIMO Y ESTÁNDAR ---
        const payload = {
            sub: usuario.empleado_id, // 'sub' (subject) es el estándar para el ID del usuario
            rol: usuario.rol
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }); // aquí se guarda el playload que se tomo en la estrategia de jwt
        return token;
    } catch (error) {
        throw new AppError('Error al generar token', 500);
    }
}
export default generarToken;