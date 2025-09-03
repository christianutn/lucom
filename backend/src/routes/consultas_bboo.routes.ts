import { crearConsultaBboo } from "../controllers/consulta_bboo.controller.js";
import { Router } from "express";
import passport from 'passport';
import autorizar from '../utils/autorizar.js';
import { param, body, query } from 'express-validator';
import manejarValidacionErrores from '../middlewares/manejarValidacionErrores.js';
import Venta from '../models/venta.models.js';
import DetalleBboo from '../models/detalle_bboo.models.js';
import AppError from "../utils/appError.js";
import TipoDomicilio from "../models/tipo_domicilio.models.js";
import TipoDocumento from "../models/tipo_documento.models.js";
const router = Router();


router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["ADM", "VEND"]),
    [


        body('detalles.tipos_domicilios_id')
            .exists()
            .isInt({ min: 1 })
            .custom(async (tipos_domicilios_id, { req }) => {
                const tipo_domicilio = await TipoDomicilio.findByPk(tipos_domicilios_id);
                if (!tipo_domicilio) {
                    throw new AppError('El tipo de domicilio no existe', 400);
                }
            }),
        
            body('cliente.tipo_documento')
                .optional({checkFalsy: true})
                .isInt({ min: 1 })
                .custom(async (tipo_documento, { req }) => {
                    const tipoDoc = await TipoDocumento.findByPk(tipo_documento);
                    if (!tipoDoc) {
                        throw new AppError('El tipo de documento no existe', 400);
                    }
                }),


    ],
    manejarValidacionErrores,
    crearConsultaBboo);


export default router;
