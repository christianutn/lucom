// backend/src/middlewares/validators/Cliente.validator.ts
import { body,  ValidationChain } from 'express-validator';
import AppError from '../../utils/appError.js';
import Cliente from '../../models/cliente.models.js';
import TelefonoPrincipal from '../../models/telefono_principal.models.js';


// Definimos el middleware como un array de validadores y manejadores.
// NO es una función async. Es simplemente un array.
export const validarAtributosTelefonosPrincipales: ValidationChain[] = [
    // --- Grupo 1: Validaciones de campos comunes ---
    body('telefonos_principales').isArray().withMessage("El objeto 'telefonos_principales' debe ser un array.")
    .isLength({ min: 1 }).withMessage("El array 'telefonos_principales' debe tener al menos un elemento."),

    body('telefonos_principales.*.id').optional({checkFalsy: true}).isInt({min: 1}).withMessage('El id debe ser un número entero')
    .custom(async (value, { req }) => {
        const telefono_principal = await TelefonoPrincipal.findByPk(value);
        if (!telefono_principal) {
            throw new AppError(`El teléfono con el id ${value} no existe`, 400);
        }
        return true;
    }),

    body('telefonos_principales.*.cliente_id')
    .exists().withMessage('El campo "cliente_id" es requerido.')
    .isInt({ min: 1 }).trim().withMessage('El campo "cliente_id" debe ser un entero positivo.')
    .custom(async (value, { req }) => {
        const cliente = await Cliente.findByPk(value);
        if (!cliente) {
            throw new AppError('El cliente no existe.', 400);
        }
        return true;
    }),

    body('telefonos_principales.*.numero_telefono')
    .isString().trim().withMessage('El campo "numero_telefono" debe ser una cadena de texto.')
    .matches(/^\d+$/).withMessage('El campo "numero_telefono" debe ser una cadena de texto formada por dígitos')
    .isLength({ min: 10, max: 10 }).withMessage('El campo "numero_telefono" debe ser una cadena de texto formada por 10 dígitos')
    
    
];



