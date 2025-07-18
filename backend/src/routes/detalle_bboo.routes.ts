import { getDetallesBboo, getDetalleBbooPorID, createDetalleBboo, actualizarDetalleBboo } from '../controllers/detalle_bboo.controller.js'
import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { param, body, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import Venta from '../models/venta.models.js';
import DetalleBboo from '../models/detalle_bboo.models.js';
import AppError from "../utils/appError.js";
import TipoDomicilio from "../models/tipo_domicilio.models.js";
const router = Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    [
        query('linea_claro_a_consultar')
            .optional()
            .isString().trim()
            .isLength({ max: 10, min: 10 })
            .matches(/^\d{10}$/).withMessage('El campo linea_claro_a_consultar debe ser una cadena de texto formada por 10 dígitos'),
        query('tipos_domicilios_id')
            .optional()
            .isInt({ min: 1 })
            .custom(async (tipos_domicilios_id, { req }) => {
                const tipo_domicilio = await TipoDomicilio.findByPk(tipos_domicilios_id);
                if (!tipo_domicilio) {
                    throw new AppError('El tipo de domicilio no existe', 400);
                }
            })

    ],
    manejarValidacionErrores,
    getDetallesBboo);

router.get('/:venta_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    [
    ],
    manejarValidacionErrores,
    param('venta_id').exists().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo'),
    getDetalleBbooPorID);

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

                const existenDetallesBboo = await DetalleBboo.findByPk(venta_id);
                if (existenDetallesBboo) {
                    throw new AppError('La venta ya existe un detalle porta', 400);
                }
            }),

        body('linea_claro_a_consultar')
            .exists()
            .isString().trim()
            .isLength({ max: 10, min: 10 })
            .matches(/^\d{10}$/).withMessage('El campo linea_claro_a_consultar debe ser una cadena de texto formada por 10 dígitos'),

        body('tipos_domicilios_id')
            .exists()
            .isInt({ min: 1 })
            .custom(async (tipos_domicilios_id, { req }) => {
                const tipo_domicilio = await TipoDomicilio.findByPk(tipos_domicilios_id);
                if (!tipo_domicilio) {
                    throw new AppError('El tipo de domicilio no existe', 400);
                }
            }),

        body('pedido_rellamado')
            .optional()
            .isString().trim()
            .isLength({ max: 150, min: 1 })
    ],
    manejarValidacionErrores,
    createDetalleBboo);

router.put('/:venta_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        body('venta_id').exists().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo')
            .custom(async (venta_id, { req }) => {
                const venta = await Venta.findByPk(venta_id);
                if (!venta) {
                    throw new AppError('Venta no encontrada', 400);
                }

                const existenDetallesBboo = await DetalleBboo.findByPk(venta_id);
                if (existenDetallesBboo) {
                    throw new AppError('La venta ya existe un detalle porta', 400);
                }
            }),

        body('linea_claro_a_consultar')
            .optional()
            .isString().trim()
            .isLength({ max: 10, min: 10 })
            .matches(/^\d{10}$/).withMessage('El campo linea_claro_a_consultar debe ser una cadena de texto formada por 10 dígitos'),

        body('tipos_domicilios_id')
            .exists()
            .isInt({ min: 1 })
            .custom(async (tipos_domicilios_id, { req }) => {
                const tipo_domicilio = await TipoDomicilio.findByPk(tipos_domicilios_id);
                if (!tipo_domicilio) {
                    throw new AppError('El tipo de domicilio no existe', 400);
                }
            }),

        body('pedido_rellamado')
            .optional()
            .isString().trim()
            .isLength({ max: 150, min: 1 })
    ],
    manejarValidacionErrores,
    actualizarDetalleBboo);



export default router;
