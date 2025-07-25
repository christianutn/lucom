// backend/src/services/strategies/StrategyManager.ts
import { IStrategyDetalleVenta,  } from './IStrategyDetalleVenta.js';
import BafStrategy from './venta_baf.strategy.js';
import PortaStrategy from './venta_porta.strategy.js';
import BbooStrategy from './venta_bboo.strategy.js';
import BafConPortaStrategy from './venta_por_dos_baf_porta.strategy.js';
import AppError from '../../utils/appError.js';

// Mapeamos el ID del tipo de negocio a su clase de estrategia correspondiente.
// Usamos 'any' aquí para permitir instanciar con 'new' dinámicamente.
const strategies: { [key: number]: new () => IStrategyDetalleVenta } = {
    1: PortaStrategy,
    2: BafStrategy,
    3: BbooStrategy,
    4: BafConPortaStrategy
};

export const getStrategy = (tipo_negocio_id: number): IStrategyDetalleVenta => {
    const StrategyClass = strategies[tipo_negocio_id];

    if (!StrategyClass) {
        throw new AppError(`Tipo de negocio con ID '${tipo_negocio_id}' no tiene una estrategia definida.`, 400);
    }

    // Devolvemos una nueva instancia de la estrategia correcta
    return new StrategyClass();
};