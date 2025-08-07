// backend/src/services/strategies/IStrategyDetalleVenta.ts
import { Transaction } from 'sequelize';
import { ValidationChain } from 'express-validator';
import { IDatalleBafCreate } from "../../types/detalle_baf.js"; 
import { IDetallePortaParametro } from "../../types/detallePorta.js";
import { IVentaAttributes } from "../../types/venta.js";
import { IClienteAttributes } from "../../types/cliente.js";
import { IDomicilioAttributes } from "../../types/domicilio.js";
import { IBarrioAttributes } from "../../types/barrio.js";
import { IDetalleBbooCreate } from '../../types/detalle_bboo.js';
import { IDetalleBafPortaCreate } from '../../types/detalle_baf_con_porta.js'



export interface IStrategyDetalleVenta {

  createDetails(detalles: IDatalleBafCreate | IDetallePortaParametro | IDetalleBbooCreate | IDetalleBafPortaCreate , transaction: Transaction): Promise<any>;
  getDetails(venta_id: number, transaction: Transaction): Promise<any>;
  getValidationRules(): ValidationChain[];
  cargar_nueva_fila(venta: IVentaAttributes, 
    detalles: IDatalleBafCreate | IDetallePortaParametro | IDetalleBbooCreate, 
    cliente: IClienteAttributes, 
    domicilio: IDomicilioAttributes, 
    barrio: IBarrioAttributes): Promise<any>;

}