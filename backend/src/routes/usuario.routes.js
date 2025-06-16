import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { body, param, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import { getUsuarios, createUsuario, getUsuarioPorId, actualizarUsuario, eliminarUsuario} from '../controllers/usuario.controller.js'

const router = Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        query('empleado_id').optional().isInt({ min: 1 }).withMessage('El id del cliente debe ser un entero positivo'),
        query('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        query('rol').optional().isString().length({ min: 2, max: 45 }).isIn(['VEND', 'ADM']).withMessage('El campo rol debe ser VEND o ADM')
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
        body('empleado_id').isInt({ min: 1 }).withMessage('El id del empleado debe ser un entero positivo'),
        body('rol').isString().length({ min: 2, max: 45 }).withMessage('El campo rol debe ser VEND o ADM'),
        body('activo').isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    createUsuario);

router.put('/:empleado_id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('empleado_id').exists().isInt({ min: 1 }).withMessage('El ID de emleado debe ser un número entero positivo'),
        body('descripcion').optional().isString().isLength({ min: 1, max: 50 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
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