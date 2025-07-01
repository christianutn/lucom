// backend/src/services/strategies/BafStrategy.ts
import { body, ValidationChain } from 'express-validator';
import { Transaction } from 'sequelize';
import DetalleBaf from '../../models/detalle_baf.models.js';
import { IStrategyDetalleVenta } from './venta.strategy.js';
import AppError from '../../utils/appError.js';
import { IDatalleBafCreate } from '../../types/detalle_baf.js'

class BafStrategy implements IStrategyDetalleVenta {
    public async createDetails(detalles: IDatalleBafCreate, transaction: Transaction): Promise<any> {
        if (!detalles) {
            throw new AppError('Los detalles para BAF son requeridos.', 400);
        }
        
        return DetalleBaf.create({
            ...detalles
        }, { transaction });
    }

    public async getDetails(venta_id: number, transaction: Transaction): Promise<any> {
        return DetalleBaf.findAll({ where: { venta_id }, transaction });
    }

    public getValidationRules(): ValidationChain[] {
        return [
            body('detalles').notEmpty().withMessage('Los detalles son requeridos'),
            body('detalles.tipos_domicilios_id')
            .exists()
            .trim()
            .isInt({ min: 1 })
            .withMessage('El tipos_domicilios_id debe ser un número entero positivo'),
            body('detalles.abono_id')
            .exists()
            .trim()
            .isInt({ min: 1 })
            .withMessage('El abono_id debe ser un número entero positivo'),
            body('detalles.TVHD')
            .exists()
            .trim()
            .isIn([0, 1])
            .withMessage('El tvhd debe ser un 1 o 0'),
            body('detalles.cantidad_decos')
            .exists()
            .trim()
            .isInt({ min: 0 })
            .withMessage('El cantidad_decos debe ser un número entero positivo'),
            body('detalles.tipo_convergencia_id')
            .exists()
            .trim()
            .isInt({ min: 1 })
            .withMessage('El tipo_convergencia_id debe ser un número entero positivo'),
            body('detalles.horario_contacto')
            .exists()
            .isString()
            .trim()
            .isLength({ min: 1, max: 150 })
            .withMessage('El comentario de horario de contacto debe tener.maxcdn de 150 caracteres'),
        ]
    }

    private __cargar_nueva_fila(detalles: any, detalle: any) {
        return
    }
}

export default BafStrategy;