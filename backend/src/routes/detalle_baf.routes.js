import { getDetallesBaf, createDetalleBaf, actualizarDetalleBaf, eliminarDetalleBaf } from "../controllers/detalle_baf.controller.js";
import express from "express";
import passport from "passport";
import autorizar from "../utils/autorizar.js";
import {  body, query, param } from "express-validator";
import manejerValidacionErrores from "../middlewares/manejarValidacionErrores.js";
import AppError from "../utils/appError.js";
import DetalleBaf from "../models/detalle_baf.models.js";


const router = express.Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    [
        // venta_id
        query('venta_id').optional().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo'),
        //tipos_domicilio_id
        query('tipos_domicilio_id').optional().isInt({ min: 1 }).withMessage('El tipos_domicilio_id debe ser un número entero positivo'),
        //abono_id
        query('abono_id').optional().isInt({ min: 1 }).withMessage('El abono_id debe ser un número entero positivo'),
        // TVHD
        query('tvhd').optional().isInt({ min: 1 }).withMessage('El tvhd debe ser un número entero positivo'),
        // cantidad_decos
        query('cantidad_decos').optional().isInt({ min: 1 }).withMessage('El cantidad_decos debe ser un número entero positivo'),
        // tipo_convergencia
        query('tipo_convergencia').optional().isInt({ min: 1 }).withMessage('El tipo_convergencia debe ser un número entero positivo'),
    ],
    manejerValidacionErrores,
    getDetallesBaf);

router.post('/', 
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        body('venta_id').exists().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo')
            .custom(async (value, { req }) => {
                const detalle_baf = await DetalleBaf.findOne({ where: { venta_id: value } });
                if (detalle_baf) {
                    throw new AppError('Ya existe un detalle de BAF para esta venta', 400);
                }
            }),
        body('tipos_domicilio_id').exists().isInt({ min: 1 }).withMessage('El tipos_domicilio_id debe ser un número entero positivo'),
        body('abono_id').exists().isInt({ min: 1 }).withMessage('El abono_id debe ser un número entero positivo'),
        body('tvhd').exists().isIn([0, 1]).withMessage('El tvhd debe ser un 1 ó 0'),
        body('cantidad_decos').exists().isInt({ min: 0 }).withMessage('El cantidad_decos debe ser un número entero positivo'),
        body('tipo_convergencia').exists().isInt({ min: 1 }).withMessage('El tipo_convergencia debe ser un número entero positivo'),
        body('horario_contacto').exists().optional().isString().isLength({ min: 1, max: 150 }).withMessage('El comentario de horario de contacto debe tener.maxcdn de 150 caracteres'),
    ],
    manejerValidacionErrores,
    createDetalleBaf
)

router.put('/:venta_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        param('venta_id').exists().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo'),
        body('tipos_domicilio_id').optional().isInt({ min: 1 }).withMessage('El tipos_domicilio_id debe ser un número entero positivo'),
        body('abono_id').optional().isInt({ min: 1 }).withMessage('El abono_id debe ser un número entero positivo'),
        body('tvhd').optional().isIn([0, 1]).withMessage('El tvhd debe ser un 1 o 0'),
        body('cantidad_decos').optional().isInt({ min: 0 }).withMessage('El cantidad_decos debe ser un número entero positivo'),
        body('tipo_convergencia').optional().isInt({ min: 1 }).withMessage('El tipo_convergencia debe ser un número entero positivo'),
        body('horario_contacto').optional().isString().isLength({ min: 1, max: 150 }).withMessage('El comentario de horario de contacto debe tener.maxcdn de 150 caracteres'),
    ],
    manejerValidacionErrores,
    actualizarDetalleBaf)

    router.delete('/:venta_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        param('venta_id').exists().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo'),
    ],
    manejerValidacionErrores,
    eliminarDetalleBaf)



export default router;