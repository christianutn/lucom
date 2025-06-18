import { getDomicilios, createDomicilio, eliminarDomicilio, actualizarDomicilio } from '../controllers/domicilio.controller.js';
import { Router } from 'express';
import { param, body, query } from 'express-validator';
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import Cliente from '../models/cliente.models.js';
import Barrio from '../models/barrio.models.js';


const router = Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        query('cliente_id').optional().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo'),
        query('barrio_id').optional().isInt({ min: 1 }).withMessage('El id del barrio debe ser un entero positivo'),
        query('nombre_calle').optional().isString().isLength({ min: 1, max: 150 }).withMessage('El barrio debe ser una cadena de texto de un máximo de 150 caracteres'),
        query('numero_calle').optional().isString().isLength({ min: 1, max: 15 }).withMessage('El número de calle es inválido'),
    ],
    manejarValidacionErrores,
    getDomicilios);


router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        body('cliente_id').exists().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo'),
        body('nombre_calle').exists().isString().isLength({ min: 1, max: 150 }).withMessage('El barrio debe ser una cadena de texto de un máximo de 150 caracteres'),
        body('numero_calle').exists().isString().isLength({ min: 1, max: 15 }).matches(/^\d+$/).withMessage('El barrio es obligatorio'),
        body('entre_calle_1').exists().isString().isLength({ min: 1, max: 150 }).withMessage('El nombre entre calle (1) debe ser un string como máximo de 150 caracteres'),
        body('entre_calle_2').exists().isString().isLength({ min: 1, max: 150 }).withMessage('El nombre entre calle (2) debe ser un string como máximo de 150 caracteres'),
        body('barrio_id').exists().isInt({ min: 1 }).withMessage('El barrio es obligatorio, debe ser un entero'),
        body('piso').optional().isInt({ min: 1 }).withMessage('El piso debe ser un entero'),
        body('departamento').optional().isString().isLength({ min: 1, max: 2 }).withMessage('El departamento debe tener como máximo 2 caracteres'),
    ],
    manejarValidacionErrores,
    createDomicilio);


router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
    ],
    manejarValidacionErrores,
    eliminarDomicilio);


router.put('/:id', 
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        param('id').exists().isInt({min:1}).withMessage('El ID debe ser un número entero positivo'),
        body('cliente_id').optional().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo'),
        body('nombre_calle').optional().isString().isLength({ min: 1, max: 150 }).withMessage('El barrio debe ser una cadena de texto de un máximo de 150 caracteres'),
        body('numero_calle').optional().isString().isLength({ min: 1, max: 15 }).matches(/^\d+$/).withMessage('El barrio es obligatorio'),
        body('entre_calle_1').optional().isString().isLength({ min: 1, max: 150 }).withMessage('El nombre entre calle (1) debe ser un string como.maxcdn'),
        body('entre_calle_2').optional().isString().isLength({ min: 1, max: 150 }).withMessage('El nombre entre calle (2) debe ser un string como.maxcdn'),
        body('barrio_id').optional().isInt({ min: 1 }).withMessage('El barrio es obligatorio, debe ser un entero'),
    ],
    manejarValidacionErrores,
    actualizarDomicilio
)

export default router;