import { getClientes, createCliente, eliminarCliente, actualizarCliente } from "../controllers/cliente.controller.js";
import { Router } from "express";
import passport from "passport";
import autorizar from "../utils/autorizar.js";
import { check, body, param, query } from "express-validator";
import Cliente from "../models/cliente.models.js";
import manejarValidacionErrores from "../middlewares/manejarValidacionErrores.js";
import AppError from "../utils/appError.js";

const router = Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    [
        query('tipo_documento').optional().trim().isInt({min: 1}).withMessage('El tipo de documento debe ser un entero mayor o igual a 1'),
        query('numero_documento').optional().isString().trim().isLength({ min: 5, max: 8 }).matches(/^\d+$/).withMessage('El número de documento debe ser una cadena de texto'),
        query('activo').optional().trim().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        query('nombre').optional().isString().trim().isLength({ min: 1, max: 50 }).withMessage('El campo nombre debe ser una cadena de texto'),
        query('apellido').optional().isString().trim().isLength({ min: 1, max: 50 }).withMessage('El campo apellido debe ser una cadena de texto'),
        query('correo_electronico').optional().trim().isEmail().withMessage('El campo correo_electronico debe ser una cadena de texto'),
    ],
    manejarValidacionErrores,
    getClientes);


router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    [
        body('tipo_documento').exists().trim().isInt({ min: 1 }).withMessage('Tipo de documento debe ser un entero'),
        body('numero_documento').exists().isString().trim().isLength({ min: 5, max: 8 }).matches(/^\d+$/).withMessage('El número de documento debe ser un string de 5 a 8 caracteres que solo contenga digitos')
            .custom(async (value, { req }) => {
                const cliente = await Cliente.findOne({
                    where: {
                        numero_documento: value,
                        tipo_documento: req.body.tipo_documento
                    }
                })
                if (cliente) throw new AppError('El cliente ya existe con el mismo número de documento y tipo de documento', 400);
            }),
        body('apellido').exists().isString().trim().isLength({ min: 1, max: 50 }).withMessage('El campo apellido debe ser una cadena de texto'),
        body('nombre').exists().isString().trim().isLength({ min: 1, max: 50 }).withMessage('El campo nombre debe ser una cadena de texto'),
        body('telefono_secundario').optional().isString().trim().withMessage('El campo telefono_secundario debe ser una cadena de texto'),
        body('fecha_nacimiento').optional().isString().trim().withMessage('El campo fecha_nacimiento debe ser una cadena de texto'),
        body('correo_electronico').exists().isEmail().trim().withMessage('El campo correo_electronico debe ser una cadena de texto'),
        body('fecha_nacimiento').optional().isString().trim().withMessage('El campo fecha_nacimiento debe ser una cadena de texto')
            .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('El campo fecha_nacimiento debe ser una cadena de texto con el formato YYYY-MM-DD'),
    ],
    manejarValidacionErrores,
    createCliente);


router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
    ],
    manejarValidacionErrores,
    eliminarCliente);


router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        param('id').exists().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
            .custom(async (value, { req }) => {
                const cliente = await Cliente.findOne({
                    where: {
                        id: value
                    }
                });
                if (!cliente) throw new AppError('El cliente no existe', 400);
            }),
        body('tipo_documento').optional().trim().isInt({ min: 1 }).withMessage('El tipo de documento debe ser un entero'),
        body('numero_documento').optional().isString().trim().isLength({ min: 5, max: 8 }).matches(/^\d+$/).withMessage('El campo dni debe ser una cadena de texto'),
        body('nombre').optional().isString().trim().isLength({ min: 1, max: 50 }).withMessage('El campo nombre debe ser una cadena de texto'),
        body('apellido').optional().isString().trim().isLength({ min: 1, max: 50 }).withMessage('El campo apellido debe ser una cadena de texto'),
        body('telefono_secundario').optional().isString().trim().withMessage('El campo telefono_secundario debe ser una cadena de texto'),
        body('fecha_nacimiento').optional().isString().trim().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('El campo fecha_nacimiento debe ser una cadena de texto con formato yyyy-mm-dd'),
        body('activo').optional().trim().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        body('correo_electronico').optional().isEmail().trim().withMessage('El campo correo_electronico debe ser una cadena de texto')
    ],
    manejarValidacionErrores,
    actualizarCliente);


export default router;

