// backend/src/middlewares/validators/Cliente.validator.ts
import { body,  ValidationChain } from 'express-validator';
import AppError from '../../utils/appError.js';
import Cliente from '../../models/cliente.models.js';
import Domicilio from '../../models/domicilio.models.js'
import Barrio from '../../models/barrio.models.js';


// Definimos el middleware como un array de validadores y manejadores.
// NO es una función async. Es simplemente un array.
export const validarAtributosDomicilio: ValidationChain[] = [
    // --- Grupo 1: Validaciones de campos comunes ---
    body('domicilio').notEmpty().withMessage("El objeto 'domicilio' debe ser existir."),

    body('domicilio.id')
    .optional({checkFalsy: true})
    .isInt({ min: 1 }).withMessage('El campo "id" debe ser un entero positivo.')
    .custom(async (value, { req }) => {
        const domicilio = await Domicilio.findByPk(value);
        if (!domicilio) {
            throw new AppError(`El domicilio con el id ${value} no existe`, 400);
        }
        return true;
    }),

    body('domicilio.cliente_id')
    .exists().withMessage('El campo "cliente_id" es requerido.')
    .isInt({ min: 1 }).withMessage('El campo "cliente_id" debe ser un entero positivo.')
    .custom(async (value, { req }) => {
        const cliente = await Cliente.findByPk(value);
        if (!cliente) {
            throw new AppError('El cliente no existe.', 400);
        }
        return true;
    }),

    body('domicilio.nombre_calle')
    .exists().withMessage('El campo "nombre_calle" es requerido.')
    .isString().trim().withMessage('El campo "nombre_calle" debe ser una cadena de texto.')
    .isLength({ min: 1, max: 150 }).withMessage('El campo "nombre_calle" debe tener un máximo de 150 caracteres.'),

    body('domicilio.numero_calle')
    .exists().withMessage('El campo "numero_calle" es requerido.')
    .isString().withMessage('El campo "numero_calle" debe ser una cadena de texto.')
    .isLength({ min: 1, max: 15 }).withMessage('El campo "numero_calle" debe tener un máximo de 15 caracteres.'),

    body('domicilio.entre_calle_1')
    .optional()
    .isString().trim().withMessage('El campo "entre_calle_1" debe ser una cadena de texto.')
    .isLength({ min: 1, max: 150 }).withMessage('El campo "entre_calle_1" debe tener un.maxcdn 150 caracteres.'),

    body('domicilio.entre_calle_2')
    .optional()
    .isString().trim().withMessage('El campo "entre_calle_2" debe ser una cadena de texto.')
    .isLength({ min: 1, max: 150 }).withMessage('El campo "entre_calle_2" debe tener un.maxcdn 150 caracteres.'),

    body('domicilio.piso')
    .optional()
    .isInt({ min: 1 }).trim().withMessage('El campo "piso" debe ser un entero positivo.'),

    body('domicilio.departamento')
    .optional()
    .isString().trim().withMessage('El campo "departamento" debe ser una cadena de texto.')
    .isLength({ min: 1, max: 2}).withMessage('El campo "departamento" debe tener máximo de 2 caracteres.'),

    body('domicilio.barrio_id')
    .exists().withMessage('El campo "barrio_id" es requerido.')
    .isInt({ min: 1 }).withMessage('El campo "barrio_id" debe ser un entero positivo.')
    .custom(async (value, { req }) => {
        const barrio = await Barrio.findByPk(value);
        if (!barrio) {
            throw new AppError(`El barrio con el id ${value} no existe`, 400);
        }
        return true;
    }),
    
];