// Cliente.ts
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