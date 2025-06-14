import { getDetallesPorta, createDetallePorta, actualizarDetallePorta, eliminarDetallePorta } from '../controllers/detalle_porta.controller.js'
import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { param, body, query } from 'express-validator';
import manejerValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import Venta from '../models/venta.models.js';
import DetallePorta from '../models/detalle_porta.models.js';


const router = Router();

router.get('/', 
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    [
        query('venta_id').optional().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo'),
        query('NIM_a_portar').optional().isString().isLength({ max: 15, min:1}).withMessage('El NIM_a_portar debe contener 15 caracteres como máximo'),
        query('gigas').optional().isString().isLength({ max: 15, min:1 }).withMessage('El id de gigas debe contener 15 caracteres como máximo'),
        query('compania').optional().isString().isLength({ max: 15, min:1 }).withMessage('El id de gigas debe contener 15 caracteres como máximo'),
    ],
    manejerValidacionErrores,
    getDetallesPorta);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        body('venta_id').exists().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo')
        .custom(async (venta_id, { req }) => {
            const venta = await Venta.findByPk(venta_id);
            if (!venta) {
                throw new Error('Venta no encontrada');
            }

            const existenDetallesPorta = await DetallePorta.findByPk(venta_id);
            if (existenDetallesPorta) {
                throw new Error('La venta ya existe un detalle porta');
            }
        }),

        body('NIM_a_portar').exists().isString().isLength({ max: 15, min:1}).withMessage('El NIM_a_portar debe contener 15 caracteres como.maxcdn'),
        body('gigas').exists().isInt({ min: 1 }).withMessage('El id de gigas debe contener 15 caracteres como máximo'),
        body('compania').exists().isInt({ min: 1 }).withMessage('El id de gigas debe contener 15 caracteres como máximo'),
    ],
    manejerValidacionErrores,
    createDetallePorta);

router.put('/:venta_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        param('venta_id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
        .custom(async (venta_id, { req }) => {
            const detallePorta = await DetallePorta.findByPk(venta_id);
            if (!detallePorta) {
                throw new Error('Detalle porta no encontrado');
            }
        }),
        body('NIM_a_portar').optional().trim().isString().isLength({ max: 15, min:1}).withMessage('El NIM_a_portar debe contener 15 caracteres como.maxcdn'),
        body('gigas').optional().trim().isInt({ min: 1 }).withMessage('El id de gigas debe contener 15 caracteres como.maxcdn'),
        body('compania').optional().trim().isInt({ min: 1 }).withMessage('El id de gigas debe contener 15 caracteres como.maxcdn'),
    ],
    manejerValidacionErrores,
    actualizarDetallePorta);

    router.delete('/:venta_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        param('venta_id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    ],
    manejerValidacionErrores,
    eliminarDetallePorta);


export default router;



