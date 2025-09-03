
/**
 * Interface para ConsultaBboo
 * @property id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property linea_claro_a_consultar Número de Identificación del Móvil (NIM) que se va a portar
 * @property pedido_rellamado Cantidad de gigas contratados
 */

export interface IConsultaBbooAttributes {
  id: number;
  tipos_domicilios_id : number;
  linea_claro_a_consultar: string;
  pedido_rellamado: string;
  cliente_id: number;
  domicilio_id: number;
}
/**
 * Interface para ConsultaBboo
 * @property id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property linea_claro_a_consultar Número de Identificación del Móvil (NIM) que se va a portar
 * @property pedido_rellamado Cantidad de gigas contratados
 */


export interface IConsultaBbooCreate {
  tipos_domicilios_id: number;
  linea_claro_a_consultar: string;
  pedido_rellamado?: string;
  cliente_id?: number;
  domicilio_id?: number;
}
/**
 * Interface para ConsultaBboo
 * @property id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property linea_claro_a_consultar Número de Identificación del Móvil (NIM) que se va a portar
 * @property pedido_rellamado Cantidad de gigas contratados
 */

export interface IConsultaBbooUpdate {
  id?: number;
  tipos_domicilios_id?: number;
  linea_claro_a_consultar?: string;
  pedido_rellamado?: string;
  cliente_id?: number;
  domicilio_id?: number;
}
/**
 * Interface para ConsultaBboo
 * @property id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property linea_claro_a_consultar Número de Identificación del Móvil (NIM) que se va a portar
 * @property pedido_rellamado Cantidad de gigas contratados
 */

export interface IConsultaBbooFilter {
  id?: number;
  tipos_domicilios_id?: number;
  linea_claro_a_consultar?: string;
  pedido_rellamado?: string;
  cliente_id?: number;
  domicilio_id?: number;
}
