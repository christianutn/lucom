/**
 * Representa los atributos completos del DetallePorta en la base de datos.
 * @property venta_id ID de la venta asociada
 * @property NIM_a_portar Número de Identificación del Móvil (NIM) que se va a portar
 * @property gigas Cantidad de gigas contratados
 * @property compania ID de la compañía actual o destino
 */
export interface IDetallePortaAttributes {
  venta_id: number;
  NIM_a_portar: string;
  gigas: number;
  compania: number;
}

/**
 * Interface para crear un nuevo DetallePorta.
 * Todos los campos son obligatorios.
 * @property venta_id ID de la venta asociada
 * @property NIM_a_portar Número de Identificación del Móvil (NIM) que se va a portar
 * @property gigas Cantidad de gigas contratados
 * @property compania ID de la compañía actual o destino
 */
export interface IDetallePortaCreate {
  venta_id: number;
  NIM_a_portar: string;
  gigas: number;
  compania: number;
}

/**
 * @proporty venta_id  number
 * @property nimAPortar string
 * @property gigasId number
 * @proporty companiaId
 */
export interface IDetallePortaParametro {
  venta_id: number;
  nimAPortar: string;
  gigasId: number;
  companiaId: number;
}

/**
 * Interface para actualizar un DetallePorta existente.
 * Todos los campos son opcionales, se puede actualizar uno o varios.
 * @property NIM_a_portar Nuevo número NIM a portar
 * @property gigas Nueva cantidad de gigas
 * @property compania Nueva compañía destino
 */
export interface IDetallePortaUpdate {
  NIM_a_portar?: string;
  gigas?: number;
  compania?: number;
}

/**
 * Interface para aplicar filtros al buscar DetallePortas.
 * Todos los campos son opcionales, podés filtrar por uno o varios.
 * @property venta_id Filtrar por ID de la venta
 * @property NIM_a_portar Filtrar por número NIM
 * @property gigas Filtrar por cantidad de gigas
 * @property compania Filtrar por ID de compañía
 */
export interface IDetallePortaFilter {
  venta_id?: number;
  NIM_a_portar?: string;
  gigas?: number;
  compania?: number;
}


/**
 * Interface para crear un nuevo DetallePorta.
 * Todos los campos son obligatorios.
 * @property venta_id ID de la venta asociada
 * @property NIM_a_portar_lista Número de Identificación del Móvil (NIM) que se va a portar
 * @property gigas Cantidad de gigas contratados
 * @property compania ID de la compañía actual o destino
 */


