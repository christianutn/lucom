import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { body, param, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import { getTelefonosPrincipales, getTelefonoPrincipalPorID, CreateTelefonoPrincipal, actualizarTelefonoPrincipal, eliminarTelefonoPrincipal } from '../controllers/telefono_principal.controller.js';
import TelefonoPrincipal from '../models/telefono_principal.models.js'; 
import Cliente from '../models/cliente.models.js';
import AppError from "../utils/appError.js";
const router = Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        query('numero_telefono').optional().isString().isLength({ min: 1, max: 20 }).matches(/^[0-9]+$/).withMessage('El número de telefono es inválido'),
        query('cliente_id').optional().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo'),
        query('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    getTelefonosPrincipales);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El id de telefono principal debe ser un entero positivo'),
    ],
    manejarValidacionErrores,
    getTelefonoPrincipalPorID);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        body('numero_telefono').exists().isString().isLength({ min: 1, max: 20 }).matches(/^[0-9]+$/).withMessage('El número de telefono es inválido'),
        body('cliente_id').exists().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo')
            .custom(async (value, { req }) => {

                const existe_cliente = await Cliente.findByPk(value);
                if (!existe_cliente) {
                    throw new AppError('El cliente no existe', 400);
                }

                const cliente = await TelefonoPrincipal.findOne({ where: { cliente_id: value, numero_telefono: req.body.numero_telefono } });
                if (cliente) {
                    throw new AppError('El cliente ya tiene un teléfono principal', 400);
                }
            }),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    CreateTelefonoPrincipal);

router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID del teléfono principal debe ser un número entero positivo')
            .custom(async (value, { req }) => {

                const telefono_principal = await TelefonoPrincipal.findByPk(value);
                if (!telefono_principal) {
                    throw new AppError('El teléfono principal no existe', 400);
                }
            }),
        body('numero_telefono').optional().isString().isLength({ max: 20 }).matches(/^[0-9]+$/).withMessage('El formato de teléfono es inválido'),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        body('cliente_id').optional().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo')
            .custom(async (value, { req }) => {

                const existe_cliente = await Cliente.findByPk(value);
                if (!existe_cliente) {
                    throw new AppError('El cliente no existe', 400);
                }
            })
    ],
    manejarValidacionErrores,
    actualizarTelefonoPrincipal);

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').isInt({ min: 1 }).withMessage('El id del telefono principal debe ser un entero positivo'),
    ],
    manejarValidacionErrores,
    eliminarTelefonoPrincipal);

export default router;