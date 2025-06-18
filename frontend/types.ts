
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
  id: number;
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
  telefonosPrincipales: TelefonoPrincipal[];
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
  telefonosPrincipales: Array<{ numero: string }>; // Kept simple for form inputs
  telefonoSecundario: string;
  email: string;
  domicilioSeleccionadoId: string; // ID of existing address or "NUEVO" or "" (nothing selected yet)
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
  convergencia: 'Sí' | 'No' | '';
  serviciosConvergentesIds: string[];
}

export interface InternetBafState {
  tipoDomicilioId: string;
  abonoId: string;
  tvhd: 'Sí' | 'No' | '';
  cantidadDecos: string;
  tipoConvergenciaId: string;
  lineaConvergente: string;
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
  login: (employeeId: number | string, password_raw: string) => Promise<void>;
  logout: () => void;
}
