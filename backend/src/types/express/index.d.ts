// backend\src\types\express\index.d.ts

// Importa tu interfaz personalizada
import { IUserInRequest } from '../usuario.js';

// Usa la "fusión de declaraciones" para extender los tipos existentes de Express
declare global {
  namespace Express {
    // 1. Extiende la interfaz User para que coincida con tu tipo personalizado.
    //    Passport usa esta interfaz para tipar req.user.
    interface User extends IUserInRequest {}

    // 2. Opcionalmente, puedes asegurarte de que la interfaz Request use este User.
    //    Esto a menudo ya está hecho por @types/passport, pero ser explícito no daña.
    interface Request {
      user?: User;
    }
    
  }
}

// Este export {} es crucial. Convierte el archivo en un módulo,
// lo que permite que `declare global` funcione correctamente.
export {};