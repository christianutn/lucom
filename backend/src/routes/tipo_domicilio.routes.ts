import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { body, param, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import { getTipoDomicilio, createTipoDomicilio, getTipoDomicilioPorId, actualizarTipoDomicilio, eliminarTipoDomicilio} from '../controllers/tipo_domicilio.controller.js';
import AppError from "../utils/appError.js";
import TipoDomicilio from "../models/tipo_domicilio.models.js";

const router = Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        query('descripcion').optional().isString().isLength({ min: 1, max: 50 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
        query('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    getTipoDomicilio);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
    ],
    manejarValidacionErrores,
    getTipoDomicilioPorId);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        body('descripcion').isString().isLength({ min: 1, max: 50 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
    ],
    manejarValidacionErrores,
    createTipoDomicilio);

router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
            .custom(async (value) => {
                const tipo_domicilio = await TipoDomicilio.findByPk(value);
                if (!tipo_domicilio) {
                    throw new AppError('El tipo de domicilio no existe', 400);
                }
            }),
        body('descripcion').optional().isString().isLength({ min: 1, max: 50 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    actualizarTipoDomicilio);

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    ],
    manejarValidacionErrores,
    eliminarTipoDomicilio);

export default router;