import { getDetallesBaf } from "../controllers/detalle_baf.controller.js";
import express from "express";
import passport from "passport";
import autorizar from "../utils/autorizar.js";
import { param, body, query } from "express-validator";
import manejerValidacionErrores from "../middlewares/manejarValidacionErrores.js";
import AppError from "../utils/appError.js";

const router = express.Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizar(["VEND", "ADM"]),
    [
        // venta_id
        query('venta_id').optional().isInt({ min: 1 }).withMessage('El venta_id debe ser un número entero positivo'),
        //tipos_domicilio_id
        query('tipos_domicilio_id').optional().isInt({ min: 1 }).withMessage('El tipos_domicilio_id debe ser un número entero positivo'),
        //abono_id
        query('abono_id').optional().isInt({ min: 1 }).withMessage('El abono_id debe ser un número entero positivo'),
        // TVHD
        query('tvhd').optional().isInt({ min: 1 }).withMessage('El tvhd debe ser un número entero positivo'),
        // cantidad_decos
        query('cantidad_decos').optional().isInt({ min: 1 }).withMessage('El cantidad_decos debe ser un número entero positivo'),
        // tipo_convergencia
        query('tipo_convergencia').optional().isInt({ min: 1 }).withMessage('El tipo_convergencia debe ser un número entero positivo'),
    ],
    manejerValidacionErrores,
    getDetallesBaf);



export default router;