// backend/src/services/strategies/BafStrategy.ts
import { body, ValidationChain } from 'express-validator';
import { Transaction } from 'sequelize';
import DetallePorta from '../../models/detalle_porta.models.js';
import { IStrategyDetalleVenta } from './venta.strategy.js';
import AppError from '../../utils/appError.js';
import { IDetallePortaCreate } from '../../types/detallePorta.js'
import { agregarFilaPorNombreColumnas } from "../../googleSheets/cargarDatosBAF.js";
import { NuevaFilaBaf } from "../../types/googleSheets.js";

class PortaStrategy implements IStrategyDetalleVenta {
    public async createDetails(detalles: IDetallePortaCreate, transaction: Transaction): Promise<any> {
        if (!detalles) {
            throw new AppError('Los detalles para Portabilidad son requeridos.', 400);
        }
        
        return DetallePorta.create({
            ...detalles
        }, { transaction });
    }

    public async getDetails(venta_id: number, transaction: Transaction): Promise<any> {
        return DetallePorta.findAll({ where: { venta_id }, transaction });
    }

    public getValidationRules(): ValidationChain[] {
        return [
            body('detalles').notEmpty().withMessage('Los detalles son requeridos'),
            body('detalles.NIM_a_portar')
                .exists()
                .trim()
                .isString()
                .isLength({ max: 15, min:1})
                .withMessage('El NIM_a_portar debe contener 15 caracteres como.maxcdn'),
            body('detalles.gigas')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El id de gigas debe ser un número entero positivo'),
            body('detalles.compania')
                .exists()
                .trim()
                .isInt({ min: 1 })
                .withMessage('El id de compania debe ser un número entero positivo')
        ]
    }



    //Agregamos fila

    
}

export default PortaStrategy;