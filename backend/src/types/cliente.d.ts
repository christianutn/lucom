// Cliente.ts

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
   * Interface para crear un DetalleBaf
   * @property tipo_documento - Tipo de documento
   * @property numero_documento - Número de documento
   * @property nombre - Nombre del cliente
   * @property apellido - Apellido del cliente  
   * @property fecha_nacimiento - Fecha de nacimiento del cliente
   * @property telefono_secundario - Teléfono secundario del cliente
   * @property activo - Estado del cliente (1: activo, 0: inactivo)
   * @property correo_electronico - Correo electrónico del cliente
   */
  
  // Para crear un Cliente: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IClienteCreate {
    tipo_documento: number;
    numero_documento: string;
    nombre: string;
    apellido: string;
    fecha_nacimiento?: string;
    telefono_secundario?: string;
    correo_electronico?: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IClienteUpdate {
    tipo_documento?: number;
    numero_documento?: string;
    nombre?: string;
    apellido?: string;
    fecha_nacimiento?: string;
    telefono_secundario?: string;
    correo_electronico?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por nombre y estado
  export interface IClienteFilter {
    tipo_documento?: string;
    numero_documento?: string;
    activo?: 1 | 0;
    nombre?: string;
    apellido?: string;
    correo_electronico?: string;
  }