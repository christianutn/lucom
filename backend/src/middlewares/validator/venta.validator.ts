// backend/src/middlewares/validators/venta.validator.ts
import { body, oneOf, ValidationChain } from 'express-validator';
import manejarValidacionErrores from '../manejarValidacionErrores.js';
import { getStrategy } from '../../services/strategies/venta_manager.strategy.js';
import AppError from '../../utils/appError.js';
import TipoNegocio from '../../models/tipo_negocio.models.js';
import Cliente from '../../models/cliente.models.js';
import Domicilio from '../../models/domicilio.models.js';

// Asumimos que los IDs de negocio son conocidos.
const STRATEGY_IDS = {
    PORTA:'1',
    BAF: '2',
};

// Obtenemos las reglas de la estrategia BAF una sola vez.
const bafRules = getStrategy(parseInt(STRATEGY_IDS.BAF)).getValidationRules();
const portaRules = getStrategy(parseInt(STRATEGY_IDS.PORTA)).getValidationRules();

// Definimos el middleware como un array de validadores y manejadores.
// NO es una función async. Es simplemente un array.
export const validarCreacionVenta = (): (ValidationChain | ((req: any, res: any, next: any) => void))[] =>  [
    // --- Grupo 1: Validaciones de campos comunes ---
    body('datosVenta').notEmpty().withMessage("El objeto 'datosVenta' es requerido."),
    body('datosVenta.comentario_horario_contacto')
        .exists().withMessage('El comentario de horario de contacto es requerido.')
        .isString().withMessage('El comentario debe ser texto.')
        .isLength({ min: 1, max: 150 }).withMessage('El comentario debe tener máximo 150 caracteres.'),

    body('datosVenta.convergencia')
        .exists().withMessage('El campo convergencia es requerido.')
        .isIn([0, 1]).withMessage('El campo convergencia debe ser 0 o 1.'),

    body('datosVenta.tipo_negocio_id')
        .exists().withMessage('El ID del tipo de negocio es requerido.')
        .isInt({ min: 1 }).withMessage('El ID del tipo de negocio debe ser un entero positivo.')
        .custom(async (value) => {
            const existe_tipo_negocio = await TipoNegocio.findByPk(value);
            if (!existe_tipo_negocio) {
                // En validadores custom, se debe lanzar un Error, no llamar a next().
                // Express-validator lo capturará.
                throw new AppError('El tipo de negocio no existe.', 400);
            }
            return true; // Indicar que la validación fue exitosa.
        }),

    body('datosVenta.cliente_id')
        .exists().withMessage('El ID del cliente es requerido.')
        .isInt({ min: 1 }).withMessage('El ID del cliente debe ser un entero positivo.')
        .custom(async (value) => {
            const existe_cliente = await Cliente.findByPk(value);
            if (!existe_cliente) {
                throw new AppError('El cliente no existe.', 400);
            }
            return true;
        }),

    body('datosVenta.domicilio_id')
        .exists().withMessage('El ID del domicilio es requerido.')
        .isInt({ min: 1 }).withMessage('El ID del domicilio debe ser un entero positivo.')
        .custom(async (value) => {
            const existe_domicilio = await Domicilio.findByPk(value);
            if (!existe_domicilio) {
                throw new AppError('El domicilio no existe.', 400);
            }
            return true;
        }),
    
    // --- Grupo 2: Validaciones condicionales de detalles ---
    oneOf([
        [body('datosVenta.tipo_negocio_id').equals(STRATEGY_IDS.BAF), ...bafRules],
        // Aquí irían las otras estrategias cuando las descomentes.
        [body('datosVenta.tipo_negocio_id').equals(STRATEGY_IDS.PORTA), ...portaRules],

        // Si hay un tipo de negocio que no necesita detalles, puedes añadir una cadena vacía
        // o una que solo verifique el ID para que `oneOf` pueda pasar.
        //[body('tipo_negocio_id').equals('3')] // Ejemplo para BBOO sin detalles
    ], {
        message: 'Los detalles proporcionados no son válidos o no corresponden con el tipo de negocio seleccionado.',
    }),

    // --- Grupo 3: El manejador que procesa los resultados de todas las validaciones anteriores ---
    manejarValidacionErrores
];
