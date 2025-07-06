// TelefonoPrincipal.ts

// Importar clase DateTime de luxon (si vas a usarla en vez de Date)
import { DateTime } from 'luxon';

/**
 * Interface que representa los atributos completos del modelo TelefonoPrincipal.
 * Incluye todos los campos tal cual están en la base de datos.
 * 
 * @property id - ID autoincremental del registro
 * @property cliente_id - ID del cliente asociado
 * @property numero_telefono - Número de teléfono principal
 * @property fecha_modificacion - Fecha de última modificación
 * @property activo - Estado del registro (1: activo, 0: inactivo)
 */
export interface ITelefonoPrincipalAttributes {
  id: number;
  cliente_id: number;
  numero_telefono: string;
  fecha_modificacion: Date; // o DateTime si decidís usar luxon
  activo: 1 | 0;
}

/**
 * Interface para crear un nuevo TelefonoPrincipal.
 * Todos los campos son obligatorios.
 * 
 * @property cliente_id - ID del cliente asociado
 * @property numero_telefono - Número de teléfono principal
 * @property fecha_modificacion - Fecha de creación o última modificación
 */
export interface ITelefonoPrincipalCreate {
  cliente_id: number;
  numero_telefono: string;
  fecha_modificacion: Date; // o DateTime
}

/**
 * Interface para actualizar un TelefonoPrincipal existente.
 * Todos los campos son opcionales, ya que no siempre vas a actualizar todo.
 * 
 * @property cliente_id - ID del cliente (opcional)
 * @property numero_telefono - Número de teléfono (opcional)
 * @property fecha_modificacion - Fecha de modificación (opcional)
 * @property activo - Estado (1: activo, 0: inactivo) (opcional)
 */
export interface ITelefonoPrincipalUpdate {
  cliente_id?: number;
  numero_telefono?: string;
  fecha_modificacion?: Date; // ojo: ahora la puse opcional, más típico en un update
  activo?: 1 | 0;
}

/**
 * Interface para filtros en las consultas GET.
 * Permite filtrar por cliente, número de teléfono o estado.
 * 
 * @property cliente_id - ID del cliente (opcional)
 * @property numero_telefono - Número de teléfono (opcional)
 * @property activo - Estado (1: activo, 0: inactivo) (opcional)
 */
export interface ITelefonoPrincipalFilter {
  cliente_id?: number;
  numero_telefono?: string;
  activo?: 1 | 0;
}
