// backend/src/middlewares/validators/Cliente.validator.ts
import { body,  oneOf,  ValidationChain } from 'express-validator';
import AppError from '../../utils/appError.js';
import Cliente from '../../models/cliente.models.js';
import TipoDocumento from '../../models/tipo_documento.models.js';


// Definimos el middleware como un array de validadores y manejadores.
// NO es una función async. Es simplemente un array.
export const validarAtributosCliente = [
    // --- Grupo 1: Validaciones de campos comunes ---
    body('cliente').notEmpty().withMessage("El objeto 'cliente' es requerido."),


    body('cliente.id')
        .optional({ checkFalsy: true })
        .trim()
        .isInt({ min: 1 }).withMessage('El ID del cliente debe ser un número entero mayor a 0.')
        .custom(async (value) => {
            const cliente = await Cliente.findByPk(value);
            if (!cliente) throw new AppError('El cliente no existe.', 400);
            return true;
        }),

    body('cliente.id').optional().isInt().withMessage('El comentario debe ser texto.')
    .custom(async (value, { req }) => {
        const cliente = await Cliente.findByPk(value);
        if (!cliente) {
            throw new AppError('El cliente no existe.', 400);
        }
        return true;
    }),

    body('cliente.tipo_documento')
        .exists().withMessage('El tipo_documento es requerido.').trim()
        .isInt().withMessage('El comentario debe ser texto.')
        .custom(async (value) => {

            const existe_tipo_documento = await TipoDocumento.findByPk(value);
            if (!existe_tipo_documento) {
                // En validadores custom, se debe lanzar un Error, no llamar a next().
                // Express-validator lo capturará.
                throw new AppError('El tipo de documento no existe.', 400);
            }
            return true; // Indicar que la validación fue exitosa.
        }),

    body('cliente.numero_documento')
        .exists().withMessage('El numero_documento es requerido.').trim()
        .isString().withMessage('El comentario debe ser texto.')
        .matches(/^\d+$/).withMessage('El campo dni debe ser una cadena de texto formada por dígitos')
        .isLength({ min: 5, max: 8 }).withMessage('El campo dni debe ser una cadena de texto formada por dígitos'),
    
    body('cliente.nombre')
        .exists().withMessage('El nombre es requerido.').trim()
        .isString().withMessage('El comentario debe ser texto.')
        .isLength({ min: 1, max: 50 }).withMessage('El comentario debe tener.maxcdn 50 caracteres.'),
    
    body('cliente.apellido')
        .exists().withMessage('El apellido es requerido.').trim()
        .isString().withMessage('El comentario debe ser texto.')
        .isLength({ min: 1, max: 50 }).withMessage('El comentario debe tener.maxcdn 50 caracteres.'),
    
    body('cliente.telefono_secundario')
        .optional()
        .isString().trim().withMessage('El comentario debe ser texto.')
        .matches(/^\d+$/).withMessage('El campo telefono_secundario debe ser una cadena de texto formada por dígitos')
        .isLength({ min: 10, max: 10 }).withMessage('El campo telefono_secundario debe ser una cadena de texto formada por 10 dígitos'),

    body('correo_electronico')
        .optional()
        .isEmail().trim().withMessage('El correo electronico debe ser valido')
    
   
];



