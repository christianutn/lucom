import { getBarrios, getBarrioById, createBarrio, actualizarBarrio, eliminarBarrio } from '../controllers/barrio.controller.js'
import { Router } from 'express';
import { check } from 'express-validator';
import manejerValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import Barrio from '../models/barrio.models.js';
import AppError from '../utils/appError.js';

const router = Router();

router.get('/', [
    check('activo')
        .optional()
        .isIn([0, 1])
        .withMessage('El campo activo debe ser "true" o "false" (string)'),
    check('nombre')
        .optional()
        .isString()
        .withMessage('El nombre debe ser una cadena de texto'),
    check('codigo_postal')
        .optional()
        .isString()
        .withMessage('El código postal debe ser una cadena de texto')
], manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getBarrios);

router.get('/:id', [
    check('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
], manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getBarrioById);

router.post('/', [
    check('nombre')
        .notEmpty()
        .withMessage('El campo nombre es obligatorio')
        .isString()
        .isLength({ max: 150 })
        .withMessage('El nombre no puede exceder los 150 caracteres'),
    check('codigo_postal')
        .optional()
        .isString()
        .isLength({ max: 10, min: 1 })
        .withMessage('El código postal no puede exceder los 10 caracteres')
], manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    createBarrio);

router.put('/:id', [
    check('id')
        .exists()
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
        .custom(async (id) => {
            const barrio = await Barrio.findByPk(id);
            if (!barrio) {
                throw new AppError(`Barrio con ID ${id} no encontrado`, 400);
            }
        }),
    check('nombre')
        .optional()
        .isString()
        .isLength({ max: 150 })
        .withMessage('El nombre no puede exceder los 150 caracteres'),
    check('codigo_postal')
        .optional()
        .isString()
        .isLength({ max: 10 })
        .withMessage('El código postal no puede exceder los 10 caracteres'),
    check('activo')
        .optional()
        .isInt([0, 1])
        .withMessage('El campo activo debe ser un 1 ó 0')
], manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    actualizarBarrio);

router.delete('/:id', [
    check('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
], manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    eliminarBarrio);

export default router;
