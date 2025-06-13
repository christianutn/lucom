import { getCompanias, getCompaniaPorId, createCompania, actualizarCompania } from "../controllers/compania.controller.js";
import { Router } from "express";
import passport from "passport";
import autorizar from "../utils/autorizar.js";
import { check } from "express-validator";
import manejerValidacionErrores from "../middlewares/manejarValidacionErrores.js";
import Compania from "../models/compania.models.js";
import AppError from "../utils/appError.js";

const router = Router();


router.get('/',
    [
        check('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        check('descripcion').optional().isString().withMessage('El campo descripcion debe ser una cadena de texto')
    ],
    manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getCompanias);

router.get('/:id',
    check('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getCompaniaPorId);

router.post('/',
    [
        check('descripcion')
            .exists().withMessage('El campo descripcion es obligatorio')
            .isString().withMessage('El campo descripcion debe ser una cadena de texto')
            .isLength({ min: 1, max: 45 }).withMessage('La descripcion debe tener entre 1 y 45 caracteres'),
        
    ],
    manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    createCompania);

router.put('/:id',
    [
        check('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
            .custom(async (id) => {
                const compania = await Compania.findByPk(id);
                if (!compania) {
                    throw new AppError(`Compania con ID ${id} no encontrado`, 404);
                }
            }),
        check('descripcion')
            .exists().withMessage('El campo descripcion es obligatorio')
            .isString().withMessage('El campo descripcion debe ser una cadena de texto')
            .isLength({ min: 1, max: 45 }).withMessage('La descripcion debe tener entre 1 y 45 caracteres'),
        check('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    actualizarCompania);


export default router;