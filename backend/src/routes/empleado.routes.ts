import passport from 'passport';
import { Router } from 'express';
import { getEmpleados, createEmpleado,getEmpleadosPorId, actualizarEmpleado, eliminarEmpleado } from '../controllers/empleado.controller.js';
import { body, param, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import autorizar from '../utils/autorizar.js';
import Empleado from '../models/empleado.models.js';
import AppError from '../utils/appError.js';

const router = Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        query('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        query('correo_electronico').optional().isEmail().withMessage('El correo electronico debe ser valido'),
        query('nombre').optional().isString().isLength({ min: 1, max: 50 }).withMessage('El nombre debe ser una cadena de texto de un.maxcdn de 50 caracteres'),    
        query('apellido').optional().isString().isLength({ min: 1, max: 50 }).withMessage('El apellido debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
    ],
    manejarValidacionErrores,
    getEmpleados);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
    ],
    manejarValidacionErrores,
    getEmpleadosPorId);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        body('correo_electronico').exists().isEmail().withMessage('El correo electronico debe ser valido'),
        body('nombre').exists().isString().isLength({ min: 1, max: 50 }).withMessage('El nombre debe ser una cadena de texto de un.maxcdn de 50 caracteres'),    
        body('apellido').exists().isString().isLength({ min: 1, max: 50 }).withMessage('El apellido debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
    ],
    manejarValidacionErrores,
    createEmpleado
)


router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
            .custom(async (id, { req }) => {
                const empleado = await Empleado.findByPk(id);
                if (!empleado) {
                    throw new AppError('El empleado no existe', 400);
                }
            }),
        body('correo_electronico').optional().isEmail().withMessage('El correo electronico debe ser valido'),
        body('nombre').optional().isString().isLength({ min: 1, max: 50 }).withMessage('El nombre debe ser una cadena de texto de un.maxcdn de 50 caracteres'),    
        body('apellido').optional().isString().isLength({ min: 1, max: 50 }).withMessage('El apellido debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    actualizarEmpleado
)


router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    ],
    manejarValidacionErrores,
    eliminarEmpleado
)


export default router;