import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { body, param, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import { getUsuarios, createUsuario, getUsuarioPorId, actualizarUsuario, eliminarUsuario} from '../controllers/usuario.controller.js'
import Rol from "../models/rol.models.js";
import Empleado from "../models/empleado.models.js";
import Usuario from "../models/usuario.models.js";
import AppError from "../utils/appError.js";


const router = Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        query('empleado_id').optional().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo'),
        query('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        query('rol').optional().isString().isLength({ min: 2, max: 45 }).withMessage('El campo rol debe ser VEND o ADM')
    ],
    manejarValidacionErrores,
    getUsuarios);

router.get('/:empleado_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        param('empleado_id').exists().isInt({ min: 1 }).withMessage('El ID del empleadodebe ser un número entero positivo')
    ],
    manejarValidacionErrores,
    getUsuarioPorId);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        body('empleado_id').exists().isInt({ min: 1 }).withMessage('El id del empleado debe ser un entero positivo')
        .custom(async (empleado_id) => {
            const empleado = await Empleado.findByPk(empleado_id);
            if (!empleado) {
                throw new AppError('El empleado no existe', 400);
            }

            const usuario = await Usuario.findByPk(empleado_id);
            if (usuario) {
                throw new AppError('El empleado ya tiene un usuario', 400);
            }
        }),
        body('rol').exists().isString().isLength({ min: 2, max: 45 }).withMessage('El campo rol debe ser VEND o ADM')
        .custom(async (rol) => {
            const rolExistente = await Rol.findOne({ where: { codigo: rol } });
            if (!rolExistente) {
                throw new AppError('El rol no existe', 400);
            }
        }),
        body('contrasena').exists().isString().isLength({ min: 4, max: 200 }).withMessage('La contrasena debe ser un string de 4 a 45 caracteres')
    ],
    manejarValidacionErrores,
    createUsuario);

router.put('/:empleado_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('empleado_id').exists().isInt({ min: 1 }).withMessage('El ID de emleado debe ser un número entero positivo'),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        body('rol').optional().isString().isLength({ min: 2, max: 45 }).withMessage('El campo rol debe ser VEND o ADM'),
    ],
    manejarValidacionErrores,
    actualizarUsuario);

router.delete('/:empleado_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('empleado_id').exists().isInt({ min: 1 }).withMessage('El ID de empleado debe ser un número entero positivo'),
    ],
    manejarValidacionErrores,
    eliminarUsuario);

export default router;