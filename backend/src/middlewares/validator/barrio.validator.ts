// backend/src/middlewares/validators/Cliente.validator.ts
import { body,  ValidationChain } from 'express-validator';
import AppError from '../../utils/appError.js';
import Barrio from '../../models/barrio.models.js';


// Definimos el middleware como un array de validadores y manejadores.
// NO es una función async. Es simplemente un array.
export const validarAtributosBarrio : ValidationChain[] = [
    // --- Grupo 1: Validaciones de campos comunes ---
    body('barrio').notEmpty().withMessage("El objeto 'barrio' es requerido."),

    body('barrio.id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('El campo "id" debe ser un entero positivo.')
    .custom(async (value, { req }) => {
        const barrio = await Barrio.findByPk(value);
        if (!barrio) {
            throw new AppError(`El barrio con el id ${value} no existe`, 400);
        }
        return true;
    }),

    body('barrio.nombre')
    .isString().withMessage('El campo "nombre" debe ser una cadena de texto.')
    .isLength({ min: 1, max: 150 }).withMessage('El campo "nombre" debe tener un.maxcdn 150 caracteres.'),

    
];



