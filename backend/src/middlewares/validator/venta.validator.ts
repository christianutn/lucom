// backend/src/middlewares/validators/venta.validator.ts
import { body, oneOf, ValidationChain } from 'express-validator';
import manejarValidacionErrores from '../manejarValidacionErrores.js';
import { getStrategy } from '../../services/strategies/venta_manager.strategy.js';
import AppError from '../../utils/appError.js';
import TipoNegocio from '../../models/tipo_negocio.models.js';
import Cliente from '../../models/cliente.models.js';
import Domicilio from '../../models/domicilio.models.js';
import {validarAtributosCliente}  from './cliente.validator.js';
import { validarAtributosDomicilio } from './domicilio.validator.js';
import { validarAtributosBarrio } from './barrio.validator.js';
import OrigenDato from "../../models/origen_dato.models.js";
import { get } from 'http';

// Asumimos que los IDs de negocio son conocidos.
const STRATEGY_IDS = {
    PORTA:'1',
    BAF: '2',
    BBOO: '3',
    BAF_CON_PORTA: '4'
};

// Obtenemos las reglas de la estrategia BAF una sola vez.
const bafRules = getStrategy(parseInt(STRATEGY_IDS.BAF)).getValidationRules();
const portaRules = getStrategy(parseInt(STRATEGY_IDS.PORTA)).getValidationRules();
const bbooRules = getStrategy(parseInt(STRATEGY_IDS.BBOO)).getValidationRules();
const bafConPortaRules = getStrategy(parseInt(STRATEGY_IDS.BAF_CON_PORTA)).getValidationRules();


console.log('Reglas de validación de estrategia BAF:', bbooRules);

// Definimos el middleware como un array de validadores y manejadores.
// NO es una función async. Es simplemente un array.
export const validarCreacionVenta = (): (ValidationChain | ((req: any, res: any, next: any) => void))[] =>  [
    // --- Grupo 1: Validaciones de campos comunes ---
    body('datosVenta').notEmpty().withMessage("El objeto 'datosVenta' es requerido."),
    body('datosVenta.comentario_horario_contacto')
        .optional({checkFalsy: true})
        .isString().trim().withMessage('El comentario debe ser texto.')
        .isLength({ min: 1, max: 150 }).withMessage('El comentario debe tener máximo 150 caracteres.'),


    body('datosVenta.tipo_negocio_id')
        .exists().withMessage('El ID del tipo de negocio es requerido.')
        .isInt({ min: 1 }).trim().withMessage('El ID del tipo de negocio debe ser un entero positivo.')
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
        .optional({checkFalsy: true})
        .isInt({ min: 1 }).withMessage('El ID del cliente en "datosVenta" debe ser un entero positivo.')
        .custom(async (value) => {
            if (!value) return true;

            const existe_cliente = await Cliente.findByPk(value);
            if (!existe_cliente) {
                throw new AppError('El cliente no existe.', 400);
            }
            return true;
        }),

    body('datosVenta.domicilio_id')
        .if(body('datosVenta.domicilio_id').notEmpty()) 
        .isInt({ min: 1 }).withMessage('El ID del domicilio debe ser un entero positivo.')
        .custom(async (value) => {
            const existe_domicilio = await Domicilio.findByPk(value);
            if (!existe_domicilio) {
                throw new AppError('El domicilio no existe.', 400);
            }
            return true;
        }),
    
    body('datosVenta.origen_dato_id')
    .exists()
    .isInt({ min: 1 })
    .custom(async (value) => {
        const existe_origen_dato = await OrigenDato.findByPk(value);
        if (!existe_origen_dato) {
            throw new AppError('El origen de dato no existe.', 400);
        }
        return true;
    }),

    
    // --- Grupo 2: Validaciones condicionales de detalles ---
    oneOf([
        [body('datosVenta.tipo_negocio_id').equals(STRATEGY_IDS.BAF), ...bafRules],
        // Aquí irían las otras estrategias cuando las descomentes.
        [body('datosVenta.tipo_negocio_id').equals(STRATEGY_IDS.PORTA), ...portaRules],

        // --- Grupo 3: El manejador que procesa los resultados de todas las validaciones anteriores ---
        [body('datosVenta.tipo_negocio_id').equals(STRATEGY_IDS.BBOO), ...bbooRules],

        // --- Grupo 4: El manejador que procesa los resultados de todas las validacioes de bafConPorta
        [body('datosVenta.tipo_negocio_id').equals(STRATEGY_IDS.BAF_CON_PORTA), ...bafConPortaRules],

    ], {
        message: 'Los detalles proporcionados no son válidos o no corresponden con el tipo de negocio seleccionado.',
    }),

    // Validamos para cliente:
    ...validarAtributosCliente,


    // Validamos para domicilio del cliente
    ...validarAtributosDomicilio,

    //Validamos para barrio
    ...validarAtributosBarrio,
        
    // --- Grupo 3: El manejador que procesa los resultados de todas las validaciones anteriores ---
    manejarValidacionErrores
];
