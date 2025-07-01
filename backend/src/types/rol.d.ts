// Rol.ts
export interface IRolAttributes {
    codigo: number;
    descripcion: string;
    activo: 0 | 1;
  }
  
  // Para crear un Rol: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IRolCreate {
    descripcion: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IRolUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por descripcion y estado
  export interface IRolFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }