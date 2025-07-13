/**
 * Representa los atributos completos de una Venta en la base de datos.
 * @property id Identificador único de la venta
 * @property comentario_horario_contacto Comentario adicional sobre el horario de contacto
 * @property convergencia Indica si aplica convergencia (1) o no (0)
 * @property tipo_negocio_id ID del tipo de negocio asociado
 * @property fecha_realizacion Fecha en que se realizó la venta
 * @property activo Indica si la venta está activa (1) o inactiva (0)
 * @property cliente_id ID del cliente asociado
 * @property domicilio_id ID del domicilio asociado a la venta
 * @property empleado_id ID del empleado que realiza la venta
 */
export interface IVentaAttributes {
  id: number;
  comentario_horario_contacto: string;
  convergencia: 1 | 0;
  tipo_negocio_id: number;
  fecha_realizacion: Date;
  activo: 1 | 0;
  cliente_id: number;
  domicilio_id: number;
  empleado_id: number;
  origen_dato_id: number;
}

/**
 * Interface para crear una nueva Venta.
 * Todos los campos son obligatorios.
 * @property comentario_horario_contacto Comentario adicional sobre el horario de contacto
 * @property convergencia Indica si aplica convergencia (1) o no (0)
 * @property tipo_negocio_id ID del tipo de negocio asociado
 * @property fecha_realizacion Fecha en que se realiza la venta
 * @property cliente_id ID del cliente asociado
 * @property domicilio_id ID del domicilio asociado a la venta
 * @property empleado_id ID del empleado que realiza la venta
 */
export interface IVentaCreate {
  comentario_horario_contacto: string;
  convergencia: 1 | 0;
  tipo_negocio_id: number;
  fecha_realizacion: Date;
  cliente_id: number;
  domicilio_id: number;
  empleado_id: number;
  origen_dato_id: number;
}

/**
 * Interface para actualizar una Venta existente.
 * Todos los campos son opcionales; podés actualizar uno o varios.
 * @property comentario_horario_contacto Nuevo comentario sobre horario de contacto
 * @property convergencia Indica si ahora aplica convergencia (1) o no (0)
 * @property tipo_negocio_id Nuevo ID del tipo de negocio
 * @property fecha_realizacion Nueva fecha de realización de la venta
 * @property activo Cambiar el estado de la venta a activa (1) o inactiva (0)
 * @property domicilio_id Nuevo ID de domicilio asociado
 */
export interface IVentaUpdate {
  comentario_horario_contacto?: string;
  convergencia?: 1 | 0;
  tipo_negocio_id?: number;
  fecha_realizacion?: Date;
  activo?: 1 | 0;
  domicilio_id?: number;
  origen_dato_id?: number;
}



