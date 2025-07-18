// backend/src/services/strategies/IStrategyDetalleVenta.ts
import { Transaction } from 'sequelize';
import { ValidationChain } from 'express-validator';
import { IDatalleBafCreate } from "../../types/detalle_baf.js"; 
import { IDetallePortaCreate } from "../../types/detallePorta.js";
import { IVentaAttributes } from "../../types/venta.js";
import { IClienteAttributes } from "../../types/cliente.js";
import { ITelefonoPrincipalAttributes } from "../../types/telefono_principal.js";
import { IDomicilioAttributes } from "../../types/domicilio.js";
import { IBarrioAttributes } from "../../types/barrio.js";
import { IDetalleBbooCreate } from '../../types/detalle_bboo.js';

export interface IStrategyDetalleVenta {

  createDetails(detalles: IDatalleBafCreate | IDetallePortaCreate | IDetalleBbooCreate, transaction: Transaction): Promise<any>;
  getDetails(venta_id: number, transaction: Transaction): Promise<any>;
  getValidationRules(): ValidationChain[];
  cargar_nueva_fila(venta: IVentaAttributes, 
    detalles: IDatalleBafCreate | IDetallePortaCreate | IDetalleBbooCreate, 
    cliente: IClienteAttributes, 
    telefonos_principales: ITelefonoPrincipalAttributes[], 
    domicilio: IDomicilioAttributes, 
    barrio: IBarrioAttributes): Promise<any>;

}