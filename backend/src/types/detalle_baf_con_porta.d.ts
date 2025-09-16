import { IDatalleBafCreate } from "./detalle_baf.d";
import { IDetallePortaParametro } from "./detallePorta.d.js";
import { IVentaAttributes } from "./venta.d";

/**
 * 
 *  * Interface para crear un nuevo DetalleBaf.
 * Todos los campos son obligatorios.
 * @property venta_id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property abono_id ID del abono contratado
 * @property TVHD Indica si tiene TV HD (1) o no (0)
 * @property cantidad_decos Cantidad de decodificadores solicitados
 * @property horario_contacto Horario preferido de contacto
 * @property tipo_convergencia_id Tipo de convergencia (ID)
 * @property portabilidades: IDetallePortaParametro[]
 * 
 * IDetallePortaParametro:
 * @proporty venta_id  number
 * @property nimAPortar string
 * @property gigasId number
 * @proporty companiaId                                                                       
 */

export interface IDetalleBafPortaCreate extends IDatalleBafCreate {
    portabilidades: IDetallePortaParametro[];
}

