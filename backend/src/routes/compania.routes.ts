import { getCompanias, getCompaniaPorId, createCompania, actualizarCompania, eliminarCompania } from "../controllers/compania.controller.js";
import { Router } from "express";
import passport from "passport";
import autorizar from "../utils/autorizar.js";
import { check, body, query, param } from "express-validator";
import manejarValidacionErrores from "../middlewares/manejarValidacionErrores.js";
import Compania from "../models/compania.models.js";
import AppError from "../utils/appError.js";

const router = Router();


router.get('/',
    [
        query('activo').optional().trim().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        query('descripcion').optional().isString().trim().withMessage('El campo descripcion debe ser una cadena de texto')
    ],
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getCompanias);

router.get('/:id',
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getCompaniaPorId);

router.post('/',
    [
        body('descripcion')
            .exists().withMessage('El campo descripcion es obligatorio')
            .isString().trim().withMessage('El campo descripcion debe ser una cadena de texto')
            .isLength({ min: 1, max: 45 }).withMessage('La descripcion debe tener entre 1 y 45 caracteres'),
        
    ],
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    createCompania);

router.put('/:id',
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
            .custom(async (id) => {
                const compania = await Compania.findByPk(id);
                if (!compania) {
                    throw new AppError(`Compania con ID ${id} no encontrado`, 404);
                }
            }),
        body('descripcion')
            .exists().withMessage('El campo descripcion es obligatorio')
            .isString().trim().withMessage('El campo descripcion debe ser una cadena de texto')
            .isLength({ min: 1, max: 45 }).withMessage('La descripcion debe tener entre 1 y 45 caracteres'),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    actualizarCompania);

router.delete('/:id',
    param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    manejarValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    eliminarCompania);


export default router;