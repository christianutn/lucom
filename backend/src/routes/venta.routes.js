import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { body, param, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import Cliente from "../models/cliente.models.js";
import TipoNegocio from "../models/tipo_negocio.models.js";
import Venta from "../models/venta.models.js";
import { getVentas, getVentaPorId, createVenta, actualizarVenta, eliminarVenta } from '../controllers/venta.controller.js'
const router = Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        query('cliente_id').optional().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo'),
        query('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        query('convergencia').optional().isIn([0, 1]).withMessage('El campo convergencia debe ser 0 o 1'),
        query('tipo_negocio_id').optional().isInt({ min: 1 }).withMessage('El id del tipo de negocio debe ser un entero positivo'),
    ],
    manejarValidacionErrores,
    getVentas);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID del empleadodebe ser un número entero positivo')
            .custom(async (value, { req }) => {
                const venta = await Venta.findByPk(value);
                if (!venta) {
                    throw new Error('La venta no existe');
                }
            })
    ],
    manejarValidacionErrores,
    getVentaPorId);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        body('comentario_horario_contacto').exists().isString().isLength({ min: 1, max: 150 }).withMessage('El comentario de horario de contacto debe tener máximo 150 caracteres'),
        body('convergencia').exists().isIn([0, 1]).withMessage('El campo convergencia debe ser 0 o 1'),
        body('tipo_negocio_id').exists().isInt({ min: 1 }).withMessage('El id del tipo de negocio debe ser un entero positivo')
            .custom(async (value, { req }) => {

                const existe_tipo_negocio = await TipoNegocio.findByPk(value);
                if (!existe_tipo_negocio) {
                    throw new Error('El tipo de negocio no existe');
                }
            }),
        body('cliente_id').exists().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo')
            .custom(async (value, { req }) => {

                const existe_cliente = await Cliente.findByPk(value);
                if (!existe_cliente) {
                    throw new Error('El cliente no existe');
                }
            })
    ],
    manejarValidacionErrores,
    createVenta);

router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID de venta debe ser un número entero positivo'),
        body('comentario_horario_contacto').optional().isString().isLength({ min: 1, max: 150 }).withMessage('El comentario de horario de contacto debe tener.maxcdn de 150 caracteres'),
        body('convergencia').optional().isIn([0, 1]).withMessage('El campo convergencia debe ser 0 o 1'),
        body('tipo_negocio_id').optional().isInt({ min: 1 }).withMessage('El id del tipo de negocio debe ser un entero positivo')
            .custom(async (value, { req }) => {

                const existe_tipo_negocio = await TipoNegocio.findByPk(value);
                if (!existe_tipo_negocio) {
                    throw new Error('El tipo de negocio no existe');
                }
            }),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    actualizarVenta);

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID de venta debe ser un número entero positivo'),
    ],
    manejarValidacionErrores,
    eliminarVenta);



export default router;