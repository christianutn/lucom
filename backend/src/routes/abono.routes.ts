import { getAbonos, getAbonoById, createAbono, actualizarAbono, eliminarAbono } from '../controllers/abono.controller.js';
import express from 'express';
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { check, param, body } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import Abono from '../models/abono.models.js';
import AppError from "../utils/appError.js";

const router = express.Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
[
    check('descripcion').optional().trim().isString().isLength({ min: 1, max: 45 }).withMessage('El campo descripcion es obligatorio'),
    check('activo').optional().trim().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
],
    manejarValidacionErrores,
    
    getAbonos);

router.get('/:id',
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getAbonoById);

router.post('/',
    [
        check('descripcion').isString().trim().isLength({ min: 1, max: 45 }).withMessage('El campo descripcion es obligatorio')
    ],
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    createAbono);

router.put('/:id',
    [
        param('id').exists().isInt({ min: 1 }).trim().withMessage('El ID debe ser un número entero positivo')
            .custom(async (value) => {
                const abono = await Abono.findByPk(value);
                if (!abono) {
                    throw new AppError('El abono no existe', 400);
                }
            }),
        body('descripcion').optional().isString().trim().isLength({ min: 1, max: 45 }).withMessage('El campo descripcion es obligatorio'),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    actualizarAbono);

router.delete('/:id',
    check('id').exists().isInt({ min: 1 }).trim().withMessage('El ID debe ser un número entero positivo'),
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    eliminarAbono);

export default router;
