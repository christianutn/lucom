import { getDetallesPorta,getDetallePortaPorID, createDetallePorta, actualizarDetallePorta } from '../controllers/detalle_porta.controller.js'
import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { param, body, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import Venta from '../models/venta.models.js';
import DetallePorta from '../models/detalle_porta.models.js';
import AppError from "../utils/appError.js";

const router = Router();

router.get('/', 
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    [
        query('venta_id').optional().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo'),
        query('NIM_a_portar').optional().isString().isLength({ max: 15, min:1}).withMessage('El NIM_a_portar debe contener 15 caracteres como máximo'),
        query('gigas').optional().isInt({min:1}).isLength({ max: 15, min:1 }).withMessage('El id de gigas debe un número entero positivo mayor a cero'),
        query('compania').optional().isInt({ min: 1 }).withMessage('El id de compañia debe ser un número entero positivo'),
    ],
    manejarValidacionErrores,
    getDetallesPorta);

router.get('/:venta_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    [
    ],
    manejarValidacionErrores,
        param('venta_id').exists().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo'),
    getDetallePortaPorID);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        body('venta_id').exists().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo')
        .custom(async (venta_id, { req }) => {
            const venta = await Venta.findByPk(venta_id);
            if (!venta) {
                throw new AppError('Venta no encontrada', 400);
            }

            const existenDetallesPorta = await DetallePorta.findByPk(venta_id);
            if (existenDetallesPorta) {
                throw new AppError('La venta ya existe un detalle porta', 400);
            }
        }),

        body('NIM_a_portar').exists().isString().isLength({ max: 15, min:1}).withMessage('El NIM_a_portar debe contener 15 caracteres como.maxcdn'),
        body('gigas').exists().isInt({ min: 1 }).withMessage('El id de gigas debe contener 15 caracteres como máximo'),
        body('compania').exists().isInt({ min: 1 }).withMessage('El id de gigas debe contener 15 caracteres como máximo'),
    ],
    manejarValidacionErrores,
    createDetallePorta);

router.put('/:venta_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        param('venta_id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
        .custom(async (venta_id, { req }) => {
            const detallePorta = await DetallePorta.findByPk(venta_id);
            if (!detallePorta) {
                throw new AppError('Detalle porta no encontrado', 400);
            }
        }),
        body('NIM_a_portar').optional().trim().isString().isLength({ max: 15, min:1}).withMessage('El NIM_a_portar debe contener 15 caracteres como.maxcdn'),
        body('gigas').optional().trim().isInt({ min: 1 }).withMessage('El id de gigas debe ser un número entero positivo mayor a cero'),
        body('compania').optional().trim().isInt({ min: 1 }).withMessage('El id de compañia debe ser un número entero positivo'),
    ],
    manejarValidacionErrores,
    actualizarDetallePorta);



export default router;



