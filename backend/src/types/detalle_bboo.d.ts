
/**
 * Interface para DetalleBboo
 * @property venta_id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property linea_claro_a_consultar Número de Identificación del Móvil (NIM) que se va a portar
 * @property pedido_rellamado Cantidad de gigas contratados
 */

export interface IDetalleBbooAttributes {
  venta_id: number;
  tipos_domicilios_id : number;
  linea_claro_a_consultar: string;
  pedido_rellamado: string;
}
/**
 * Interface para DetalleBboo
 * @property venta_id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property linea_claro_a_consultar Número de Identificación del Móvil (NIM) que se va a portar
 * @property pedido_rellamado Cantidad de gigas contratados
 */


export interface IDetalleBbooCreate {
  venta_id: number;
  tipos_domicilios_id: number;
  linea_claro_a_consultar: string;
  pedido_rellamado?: string;
}
/**
 * Interface para DetalleBboo
 * @property venta_id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property linea_claro_a_consultar Número de Identificación del Móvil (NIM) que se va a portar
 * @property pedido_rellamado Cantidad de gigas contratados
 */

export interface IDetalleBbooUpdate {
  venta_id?: number;
  tipos_domicilios_id?: number;
  linea_claro_a_consultar?: string;
  pedido_rellamado?: string;
}
/**
 * Interface para DetalleBboo
 * @property venta_id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property linea_claro_a_consultar Número de Identificación del Móvil (NIM) que se va a portar
 * @property pedido_rellamado Cantidad de gigas contratados
 */

export interface IDetalleBbooFilter {
  venta_id?: number;
  tipos_domicilios_id?: number;
  linea_claro_a_consultar?: string;
  pedido_rellamado?: string;
}
