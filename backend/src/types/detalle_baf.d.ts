/**
 * Representa los atributos completos del DetalleBaf en la base de datos.
 * @property venta_id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property abono_id ID del abono contratado
 * @property TVHD Indica si tiene TV HD (1) o no (0)
 * @property cantidad_decos Cantidad de decodificadores solicitados
 * @property horario_contacto Horario preferido de contacto
 * @property tipo_convergencia_id Tipo de convergencia (ID)
 */
export interface IDatalleBafAttributes {
  venta_id: number;
  tipos_domicilios_id: number;
  abono_id: number;
  TVHD: 1 | 0;
  cantidad_decos: number;
  horario_contacto: string;
  tipo_convergencia_id: number;
}

/**
 * Interface para crear un nuevo DetalleBaf.
 * Todos los campos son obligatorios.
 * @property venta_id ID de la venta asociada
 * @property tipos_domicilios_id Tipo de domicilio (ID)
 * @property abono_id ID del abono contratado
 * @property TVHD Indica si tiene TV HD (1) o no (0)
 * @property cantidad_decos Cantidad de decodificadores solicitados
 * @property horario_contacto Horario preferido de contacto
 * @property tipo_convergencia_id Tipo de convergencia (ID)
 */
export interface IDatalleBafCreate {
  venta_id: number;
  tipos_domicilios_id: number;
  abono_id: number;
  TVHD: 1 | 0;
  cantidad_decos: number;
  horario_contacto: string;
  tipo_convergencia_id: number;
}

/**
 * Interface para actualizar un DetalleBaf existente.
 * Todos los campos son opcionales; podés actualizar uno o varios.
 * @property tipos_domicilios_id Nuevo tipo de domicilio (ID)
 * @property abono_id Nuevo ID del abono contratado
 * @property TVHD Indica si ahora tendrá TV HD (1) o no (0)
 * @property cantidad_decos Nueva cantidad de decodificadores
 * @property horario_contacto Nuevo horario preferido de contacto
 * @property tipo_convergencia_id Nuevo tipo de convergencia (ID)
 */
export interface IDatalleBafUpdate {
  tipos_domicilios_id?: number;
  abono_id?: number;
  TVHD?: 1 | 0;
  cantidad_decos?: number;
  horario_contacto?: string;
  tipo_convergencia_id?: number;
}

/**
 * Interface para aplicar filtros al buscar DetalleBaf.
 * Todos los campos son opcionales.
 * @property descripcion Filtrar por descripción del detalle
 * @property activo Filtrar por estado activo (1) o inactivo (0)
 */
export interface IDatalleBafFilter {
  descripcion?: string;
  activo?: 1 | 0;
}
