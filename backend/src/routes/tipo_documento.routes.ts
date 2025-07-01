import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { body, param, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import {getTipoDocumento, getTipoDocumentoPorId, createTipoDocumento, actualizarTipoDocumento, eliminarTipoDocumento} from '../controllers/tipo_documento.controller.js';
import AppError from "../utils/appError.js";
import TipoDocumento from "../models/tipo_documento.models.js";

const router = Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        query('descripcion').optional().isString().isLength({ min: 1, max: 50 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
        query('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    getTipoDocumento);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['VEND', 'ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
    ],
    manejarValidacionErrores,
    getTipoDocumentoPorId);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        body('descripcion').exists().isString().isLength({ min: 1, max: 50 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
    ],
    manejarValidacionErrores,
    createTipoDocumento);

router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
            .custom(async (value) => {
                const tipo_documento = await TipoDocumento.findByPk(value);
                if (!tipo_documento) {
                    throw new AppError('El tipo de documento no existe', 400);
                }
            }),
        body('descripcion').optional().isString().isLength({ min: 1, max: 50 }).withMessage('La descripcion debe ser una cadena de texto de un.maxcdn de 50 caracteres'),
        body('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
    ],
    manejarValidacionErrores,
    actualizarTipoDocumento);

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(['ADM']),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    ],
    manejarValidacionErrores,
    eliminarTipoDocumento);

export default router;