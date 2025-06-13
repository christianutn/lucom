import { getAbonos, getAbonoById, createAbono, actualizarAbono, eliminarAbono } from '../controllers/abono.controller.js';
import express from 'express';
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { check, param } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';

const router = express.Router();


router.get('/', [
    check('descripcion').optional().isString({ min: 45 }).withMessage('El campo descripcion es obligatorio'),
    check('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
],
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getAbonos);

router.get('/:id',
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getAbonoById);

router.post('/',
    [
        check('descripcion').isString({ max: 45, min: 1 }).withMessage('El campo descripcion es obligatorio')
    ],
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    createAbono);

router.put('/',
    [
        check('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
        check('descripcion').isString({ min: 45 }).withMessage('El campo descripcion es obligatorio'),
        check('activo').isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    actualizarAbono);

router.delete('/:id',
    check('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    eliminarAbono);

export default router;
