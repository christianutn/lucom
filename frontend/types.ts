
export interface SelectOption<T = number | string> {
  id: T;
  descripcion: string;
  activo: number;
}

export interface TipoNegocio extends SelectOption {}
export interface OrigenDato extends SelectOption {}
export interface TipoDocumento extends SelectOption<number> {} // Assuming ID is number from new mock
export interface ServicioConvergente extends SelectOption {}
export interface TipoDomicilio extends SelectOption {}
export interface Abono extends SelectOption {
  precio?: number;
}
export interface TipoConvergencia extends SelectOption {}
export interface Giga extends SelectOption {}
export interface Compania extends SelectOption {}

// Updated Barrio to match client.domicilios.barrio structure
export interface Barrio {
  id: number | string;
  nombre: string;
  codigo_postal?: string; // Optional as per new mock
  activo: number;
}

// Updated Telefono to match client.telefonosPrincipales
export interface TelefonoPrincipal {
  id: number;
  cliente_id: number;
  numero_telefono: string;
  fecha_modificacion: string;
  activo: number;
}

// Domicilio to match new structure
export interface Domicilio {
  id: number;
  cliente_id: number;
  nombre_calle: string;
  numero_calle: string;
  entre_calle_1?: string | null;
  entre_calle_2?: string | null;
  piso?: number | string | null; // Updated to allow number or string for piso
  departamento?: string | null; 
  barrio_id: number;
  barrio: Barrio; // Nested barrio object
  activo: number;
}

// Updated Cliente to match new structure

/**
 * Parámetros del cliente
 * @typedef {Object} Cliente
 * @property {number} id - ID del cliente
 * @property {number} tipo_documento - ID del tipo de documento
 * @property {string} numero_documento - Número de documento
 * @property {string} nombre - Nombre del cliente
 * @property {string} apellido - Apellido del cliente
 * @property {string} fecha_nacimiento - Fecha de nacimiento del cliente
 * @property {string} telefono_secundario - Telefono secundario del cliente
 * @property {string} correo_electronico - Correo electrónica del cliente
 * @property {number} activo - Estado del cliente
 */
export interface Cliente {
  id: number;
  tipo_documento: number; // ID of the document type
  numero_documento: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento?: string | null;
  telefono_secundario?: string | null;
  correo_electronico?: string | null;
  activo: number;
  tipoDocumento?: TipoDocumento; // For display, associated by tipo_documento ID
  domicilios: Domicilio[];
  telefono_principal: string;
}

export interface ClientSearchFilters {
  tipo_documento?: string; // Will hold the ID of TipoDocumento
  numero_documento?: string;
  apellido?: string;
  nombre?: string;
}

// Form States
export interface InitialSelectionState {
  tipoNegocioId: string;
  origenDatoId: string;
}

export interface ClientDataState {
  tipoDocumentoId: string; // Store ID as string for select compatibility
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  telefono_principal: string;
  telefonoSecundario: string;
  email: string;
  domicilioSeleccionadoId: string; // ID of existing address or "NUEVO" or "" (nothing selected yet)
  clienteId: string;
  nuevoDomicilio: {
    calle: string;
    altura: string;
    entreCalle1: string;
    entreCalle2:string;
    barrioId: string; // ID of selected barrio or new barrio name if creating
    nuevoBarrioNombre: string; // If adding a new barrio
    piso: string; // Stays string for form input
    departamento: string; // Stays string for form input
  };
  horarioContacto: string;
  serviciosConvergentesIds: string[];
  fechaNacimiento ?: string;
}


export interface ClientDataStateErrors {
  tipoDocumentoId: string; // Store ID as string for select compatibility
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  telefono_principal: string
  telefonoSecundario: string;
  email: string;
  domicilioSeleccionadoId: string;
  clienteId: string;
  nuevoDomicilio: {
    calle: string;
    altura: string;
    entreCalle1: string;
    entreCalle2:string;
    barrioId: string; // ID of selected barrio or new barrio name if creating
    nuevoBarrioNombre: string; // If adding a new barrio
    piso: string; // Stays string for form input
    departamento: string; // Stays string for form input
  };
  horarioContacto: string;
  serviciosConvergentesIds: string
  fechaNacimiento : string;
}

export interface InternetBafState {
  tipoDomicilioId: string;
  abonoId: string;
  tvhd: 'Sí' | 'No' | '';
  cantidadDecos: number | string;
  tipoConvergenciaId: string;
  lineaConvergente: string;
}

export interface ConsultaBbooState {
  tipoDomicilioId: string;
  lineaClaroAConsultar: string;
  pedidoRellamado: string;
}

export interface PortabilidadState {
  nimAPortar: string;
  gigasId: string;
  companiaActualId: string;
}

// Notification type
export interface AppNotification {
  message: string;
  type: 'success' | 'error' | 'info';
}

// Auth Context type
export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (employeeId: number | null, password_raw: string) => Promise<void>;
  logout: () => void;
  user: User | null;
}

// DInterfaces para venta
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
  tipo_negocio_id: number;
  fecha_realizacion: Date;
  cliente_id: number;
  domicilio_id: number;
  empleado_id: number;
  origen_dato_id: number;
}

/**
 * Interface para actualizar un DetalleBaf existente.
 * Todos los campos son opcionales; podés actualizar uno o varios.
 * @property id - ID del cliente
 * @property tipo_documento - Tipo de documento
 * @property numero_documento - Número de documento
 * @property nombre - Nombre del cliente
 * @property apellido - Apellido del cliente  
 * @property fecha_nacimiento - Fecha de nacimiento del cliente
 * @property telefono_secundario - Teléfono secundario del cliente
 * @property activo - Estado del cliente (1: activo, 0: inactivo)
 * @property correo_electronico - Correo electrónico del cliente

 */
export interface IClienteAttributes {
    id: number;
    tipo_documento: number;
    numero_documento: string;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    telefono_secundario: string;
    activo: 1 | 0;
    correo_electronico: string;
  }

  /**
   * @property id
   * @property cliente_id
   * @property nombre_calle
   * @property numero_calle
   * @property entre_calle_1
   * @property entre_calle_2
   * @property barrio_id
   * @property activo
   * @property piso
   * @property departamento
   */
  export interface IDomicilioAttributes {
    id: number;
    cliente_id: number;
    nombre_calle: string;
    numero_calle: string;
    entre_calle_1: string;
    entre_calle_2: string;
    barrio_id: number;
    activo: number;
    piso: number;
    departamento: string;
  }

/**
 * 
 * @property id
 * @property nombre
 * @property codigo_postal
 * @property activo
 */
  
export interface IBarrioAttributes {
    id: number;
    nombre: string;
    codigo_postal: string;
    activo: 0 | 1;
  }
  

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


// Interface para venta con detalle

/**
 * 
 * @property datosVenta
 * @property detalles
 * @property cliente
 * @property domicilio
 * @property barrio
 */

export interface IVentaConDetalle {
  datosVenta: IVentaCreate;
  detalles: IDetallePortaCreate | IDatalleBafCreate;
  cliente: IClienteAttributes;
  domicilio: IDomicilioAttributes;
  barrio: IBarrioAttributes;
}

export interface IUsuario {
  empleado_id: number;
  rol: string;
  contrasena: string;
  activo: 0 | 1;
  empleado: IEmpleado; // Assuming empleado has a nested usuario object
  nuevaContrasena?: string; // Optional for updates, required for creation
  isNuevaContrasena: 0 | 1; // Flag to indicate if a new password is being set

}

export interface IEmpleado {
  id: number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  activo: 0 | 1;
}

export interface IUsuarioUpdate {
  empleado_id: number;
  rol: string;
  activo: 0 | 1;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  isNuevaContrasena: 0 | 1; // Flag to indicate if a new password is being set
  nuevaContrasena: string; // Optional for updates, required for creation
}

/**
 * Interface para crear un nuevo Usuario.
 * Todos los campos son obligatorios.
 * @property empleado_id ID del empleado asociado al usuario
 * @property rol Rol del usuario (VEND o ADM)
 * @property activo Estado del usuario (1: activo, 0: inactivo)
 * @property nombre Nombre del usuario
 * @property apellido Apellido del usuario
 * @property correo_electronico Correo electrónico del usuario
 * @property contrasena Contraseña del usuario (opcional, si no se actualiza, se deja igual)
 */

export interface IUsuarioCreate {
  rol: string;
  activo: 0 | 1;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  contrasena?: string; 
}

export interface IRol {
  codigo: string;
  descripcion: string;
  activo: 0 | 1;
}

/**
 * Interface para OrigenDato.
 * @property id ID del origen de dato
 * @property descripcion Descripción del origen de dato
 * @property activo Estado del origen de dato (1: activo, 0: inactivo)
 * 
 */
export interface IOrigenDato {
  id: number;
  descripcion: string;
  activo: 0 | 1;
}

/**
 * Interface para crear un nuevo OrigenDato.
 * @property descripcion Descripción del origen de dato
 */
export interface IOrigenDatoCreate {
  descripcion: string;
}

/**
 * Interface para actualizar un OrigenDato.
 * @property descripcion Descripción del origen de dato
 * @property activo Estado del origen de dato (1: activo, 0: inactivo)
 * 
 */
export interface IOrigenDatoUpdate {
  descripcion: string;
  activo: 0 | 1;
  id: number;
}





/**
 * Interface para OrigenDato.
 * @property id ID del origen de dato
 * @property descripcion Descripción del origen de dato
 * @property activo Estado del origen de dato (1: activo, 0: inactivo)
 * 
 */
export interface IAbono {
  id: number;
  descripcion: string;
  activo: 0 | 1;
}

/**
 * Interface para crear un nuevo OrigenDato.
 * @property descripcion Descripción del origen de dato
 */
export interface IAbonoCreate {
  descripcion: string;
}

/**
 * Interface para actualizar un OrigenDato.
 * @property descripcion Descripción del origen de dato
 * @property activo Estado del origen de dato (1: activo, 0: inactivo)
 * 
 */
export interface IAbonoUpdate {
  descripcion: string;
  activo: 0 | 1;
  id: number;
}


/**
 * Interface para OrigenDato.
 * @property id ID del origen de dato
 * @property descripcion Descripción del origen de dato
 * @property activo Estado del origen de dato (1: activo, 0: inactivo)
 * 
 */
export interface ITipoDomicilio {
  id: number;
  descripcion: string;
  activo: 0 | 1;
}

/**
 * Interface para crear un nuevo OrigenDato.
 * @property descripcion Descripción del origen de dato
 */
export interface ITipoDomicilioCreate {
  descripcion: string;
}

/**
 * Interface para actualizar un OrigenDato.
 * @property descripcion Descripción del origen de dato
 * @property activo Estado del origen de dato (1: activo, 0: inactivo)
 * 
 */
export interface ITipoDomicilioUpdate {
  descripcion: string;
  activo: 0 | 1;
  id: number;
}

/**
 * Interface para Usuario
 * @property empleado_id 
 */

export interface User {
  empleado_id: number;
  rol: string;
  nombre: string;
  apellido: string;
  correo_electronico: string;
}