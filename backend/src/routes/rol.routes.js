import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { body, param, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import { getRoles, getRolesPorId, createRol, actualizarRol, eliminarRol } from '../controllers/rol.controller.js';
import Rol from '../models/rol.models.js';
const router = Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        query('codigo').optional().isString().isLength({ min: 1, max: 10 }).withMessage('El código debe tener un.maxcdn de 10 caracteres'),
        query('descripcion').optional().isString().isLength({ min: 1, max: 45 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 45 caracteres'),
        query('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    getRoles);

router.get('/:codigo',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        param('codigo').exists().isString().isLength({ min: 1, max: 10 }).withMessage('El código debe tener un máximo de 10 caracteres'),
    ],
    manejarValidacionErrores,
    getRolesPorId);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        body('codigo').isString().isLength({ min: 1, max: 10 }).withMessage('El código debe tener un.maxcdn de 10 caracteres')
            .custom(async (value) => {
                const rol = await Rol.findOne({ where: { codigo: value } });
                if (rol) {
                    throw new Error('El código ya existe');
                }
            }),
        body('descripcion').isString().isLength({ min: 1, max: 45 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 45 caracteres'),
    ],
    manejarValidacionErrores,
    createRol);

router.put('/:codigo',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('codigo').exists().isString().isLength({ min: 1, max: 10 }).withMessage('El código debe tener un.maxcdn de 10 caracteres'),
        body('descripcion').optional().isString().isLength({ min: 1, max: 45 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 45 caracteres'),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    actualizarRol);

router.delete('/:codigo',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('codigo').exists().isString().isLength({ min: 1, max: 10 }).withMessage('El código debe tener un.maxcdn de 10 caracteres'),
    ],
    manejarValidacionErrores,
    eliminarRol);

export default router;