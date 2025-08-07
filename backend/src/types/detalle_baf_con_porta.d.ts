import { IDatalleBafCreate } from "./detalle_baf.d"
import { IDetallePortaParametro } from "./detallePorta.d.js"
import { IVentaAttributes } from "./venta.d"

export interface IDetalleBafPortaCreate extends IDatalleBafCreate, IDetallePortaParametro {}
