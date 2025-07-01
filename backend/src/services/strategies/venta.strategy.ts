// backend/src/services/strategies/IStrategy.ts
import { Transaction } from 'sequelize';
import { ValidationChain } from 'express-validator';
import Venta from '../../models/venta.models.js'; // Asumiendo que has tipado tu modelo Venta
import { IDetallePortaCreate } from '../../types/detallePorta.js'
import { IDatalleBafCreate } from '../../types/detalle_baf.js'
import { IVentaAttributes } from '../../types/venta.js'

// Interfaz que define los métodos que cada estrategia debe implementar
export interface IStrategyDetalleVenta {
    /**
     * Crea los registros de detalle específicos para este tipo de venta.
     * @param detalles - El objeto con los datos de detalle del req.body.
     * @param venta - La instancia de la Venta recién creada.
     * @param transaction - La transacción de Sequelize para asegurar la atomicidad.
     */



    
    createDetails(detalles: IDetallePortaCreate | IDatalleBafCreate, transaction: Transaction): Promise<any>;

    getDetails(venta_id: number, transaction: Transaction): Promise<any>;
    /**
     * Devuelve un array de reglas de validación de express-validator para los detalles.
     */
    getValidationRules(): ValidationChain[];

    
}