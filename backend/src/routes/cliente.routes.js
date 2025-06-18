import { getClientes, createCliente, eliminarCliente, actualizarCliente } from "../controllers/cliente.controller.js";
import { Router } from "express";
import passport from "passport";
import autorizar from "../utils/autorizar.js";
import { check, body, param } from "express-validator";
import Cliente from "../models/cliente.models.js";
import manejerValidacionErrores from "../middlewares/manejarValidacionErrores.js";
import AppError from "../utils/appError.js";

const router = Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    getClientes);


router.post('/',
    [
        body('tipo_documento').exists().isInt({ min: 1 }).withMessage('Tipo de documento debe ser un entero'),
        body('numero_documento').exists().isString().isLength({ min: 5, max: 8 }).matches(/^\d+$/).withMessage('El número de documento debe ser un string de 5 a 8 caracteres que solo contenga digitos'),
        body('apellido').exists().isString().isLength({ min: 1, max: 50 }).withMessage('El campo apellido debe ser una cadena de texto')
            .custom(async (value, { req }) => {
                const cliente = await Cliente.findOne({
                    where: {
                        tipo_documento: req.body.tipo_documento,
                        numero_documento: req.body.numero_documento
                    }
                });
                if (cliente) throw new AppError('El cliente ya existe', 400);
            }),
        body('telefono_secundario').optional().isString().withMessage('El campo telefono_secundario debe ser una cadena de texto'),
        body('fecha_nacimiento').optional().isString().withMessage('El campo fecha_nacimiento debe ser una cadena de texto'),
        body('correo_electronico').optional().isEmail().withMessage('El campo correo_electronico debe ser una cadena de texto'),
    ],
    manejerValidacionErrores,
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    createCliente);


router.delete('/:id',
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
            })
    ],
    manejerValidacionErrores,
    eliminarCliente);


router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM"]),
    [
        check('tipo_documento').optional().isInt({ min: 1 }).withMessage('El tipo de documento debe ser un entero'),
        check('numero_documento').optional().isString().isLength({ min: 5, max: 8 }).matches(/^\d+$/).withMessage('El campo dni debe ser una cadena de texto'),
        check('nombre').optional().isString().isLength({ min: 1, max: 50 }).withMessage('El campo nombre debe ser una cadena de texto'),
        check('apellido').optional().isString().isLength({ min: 1, max: 50 }).withMessage('El campo apellido debe ser una cadena de texto'),
        check('telefono_secundario').optional().isString().withMessage('El campo telefono_secundario debe ser una cadena de texto'),
        check('fecha_nacimiento').optional().isString().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('El campo fecha_nacimiento debe ser una cadena de texto con formato yyyy-mm-dd'),
        check('activo').optional().isIn([0, 1]).withMessage('El campo activo debe ser 0 o 1'),
        check('correo_electronico').optional().isEmail().withMessage('El campo correo_electronico debe ser una cadena de texto')
    ],
    manejerValidacionErrores,
    actualizarCliente);


export default router;

