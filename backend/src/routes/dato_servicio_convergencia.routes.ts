import { getDatoServicioConvergencias, getDatoServicioConvergenciaPorId, createDatoServicioConvergencia, eliminarDatoServicioConvergencia, actualizarDatoServicioConvergencia } from "../controllers/dato_servicio_convergencia.controller.js"
import {  Router } from "express";
import passport from "passport";
import autorizar from "../utils/autorizar.js";
import AppError from "../utils/appError.js";
import { check, param, body, query } from "express-validator";
import manejarValidacionErrores from "../middlewares/manejarValidacionErrores.js";
import DatoServicioConvergencia from "../models/dato_servicio_convergencia.models.js";



const router = Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM', 'VEND']),
    [
        query('descripcion').optional().isString().withMessage('El campo descripcion debe ser una cadena de texto'),
        query('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    getDatoServicioConvergencias

)

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM', 'VEND']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    ],
    manejarValidacionErrores,
    getDatoServicioConvergenciaPorId
)

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM', 'VEND']),
    [
        body('descripcion').exists().isLength({ min: 1, max: 45 }).withMessage("La descripción debe tener entre 1 y 45 caracteres")
    ],
    manejarValidacionErrores,
    createDatoServicioConvergencia  
)


router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM', 'VEND']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
            .custom(async (id) => {
                const datoServicioConvergencia = await DatoServicioConvergencia.findByPk(id);
                if (!datoServicioConvergencia) {
                    throw new AppError(`DatoServicioConvergencia con ID ${id} no encontrado`, 404);
                }
            }),
        body('descripcion').optional().isString().isLength({ min: 1, max: 45 }).withMessage("La descripción debe tener entre 1 y 45 caracteres"),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    actualizarDatoServicioConvergencia
)


router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM', 'VEND']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
    ],
    manejarValidacionErrores,
    eliminarDatoServicioConvergencia
)

export default router;