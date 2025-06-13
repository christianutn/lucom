import { getClientes, createCliente, deleteCliente, actualizarCliente } from "../controllers/cliente.controller.js";
import { Router } from "express";
import passport from "passport";
import autorizar from "../utils/autorizar.js";
import { check } from "express-validator";
import TipoDocumento from "../models/tipo_documento.models.js"
import Cliente from "../models/cliente.models.js";
import manejerValidacionErrores from "../middlewares/manejarValidacionErrores.js";
import AppError from "../utils/appError.js";

const router = Router();

router.get('/',
    [
        check('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        check('id').optional().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
        check('nombre').optional().isString().withMessage('El campo nombre debe ser una cadena de texto'),
        check('apellido').optional().isString().withMessage('El campo apellido debe ser una cadena de texto'),
        check('numero_documento').optional().isString({ min: 5, max: 15 }).withMessage('El campo dni debe ser una cadena de texto'),
        check('tipo_documento')
            .optional()
            .isString()
            .withMessage('El campo tipo_documento debe ser una cadena de texto')


    ],
    manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getClientes);


router.post('/',
    [
        check('tipo_documento')
            .exists()
            .isInt()
            .withMessage('El campo tipo_documento debe ser un número entero')
            .custom(async (value) => {
                const tipoDocumento = await TipoDocumento.findByPk(value)
                if (!tipoDocumento) throw new AppError('El tipo de documento no existe', 404)
            }),
        check('numero_documento').exists().isString({ min: 5, max: 15 }).withMessage('El campo dni debe ser una cadena de texto'),
        check('nombre').exists().isString().withMessage('El campo nombre debe ser una cadena de texto'),
        check('apellido').exists().isString().withMessage('El campo apellido debe ser una cadena de texto')
            .custom(async (numero_documento, { req }) => {
                const cliente = await Cliente.findOne({
                    where: {
                        tipo_documento: req.body.tipo_documento,
                        numero_documento: numero_documento
                    }
                });
                if (cliente) throw new AppError('El cliente ya existe', 400);
            }),
        check('telefono_secundario').optional().isString().withMessage('El campo telefono_secundario debe ser una cadena de texto'),
        check('fecha_nacimiento').optional().isString().withMessage('El campo fecha_nacimiento debe ser una cadena de texto')
    ],
    manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    createCliente);


router.delete('/', [
    check('tipo_documento').isInt({ min: 1 }).withMessage('El tipo de documento debe ser un entero'),
    check('numero_documento').isString({ min: 5, max: 15 }).withMessage('El campo dni debe ser una cadena de texto')
        .custom(async (numero_documento, { req }) => {
            const cliente = await Cliente.findOne({
                where: {
                    tipo_documento: req.body.tipo_documento,
                    numero_documento: numero_documento
                }
            });
            if (!cliente) throw new AppError('El cliente no existe', 404);
        })
],
    manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    deleteCliente);


router.put('/', [
    check('tipo_documento').exists().isInt({ min: 1 }).withMessage('El tipo de documento debe ser un entero'),
    check('numero_documento').exists().isString({ min: 5, max: 15 }).withMessage('El campo dni debe ser una cadena de texto')
        .custom(async (numero_documento, { req }) => {
            const cliente = await Cliente.findOne({
                where: {
                    tipo_documento: req.body.tipo_documento,
                    numero_documento: numero_documento
                }
            });
            if (!cliente) throw new AppError('El cliente no existe', 404);
        }),
    check('nombre').optional().isString().withMessage('El campo nombre debe ser una cadena de texto'),
    check('apellido').optional().isString().withMessage('El campo apellido debe ser una cadena de texto'),
    check('telefono_secundario').optional().isString().withMessage('El campo telefono_secundario debe ser una cadena de texto'),
    check('fecha_nacimiento').optional().isString().withMessage('El campo fecha_nacimiento debe ser una cadena de texto'),
    check('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1')
],  
    manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    actualizarCliente);


export default router;

