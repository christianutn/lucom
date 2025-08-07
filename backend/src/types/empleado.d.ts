// Empleado.ts
export interface IEmpleadoAttributes {
    id: number;
    nombre: string;
    apellido: string;
    correo_electronico: string;
    activo: 1 | 0;
    alias: string;
  }

  // Para crear un Empleado: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IEmpleadoCreate {
    nombre: string;
    apellido: string;
    correo_electronico: string;
    activo: 1 | 0;
    alias?: string;
  }

  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IEmpleadoUpdate {
    nombre?: string;
    apellido?: string;
    correo_electronico?: string;
    activo?: 1 | 0;
    alias?: string;
  }

  // Para filtros en el GET: podrías filtrar por nombre y estado
  export interface IEmpleadoFilter {
    nombre?: string;
    apellido?: string;
    correo_electronico?: string;
    activo?: 1 | 0;
    alias?: string;
  
  }