// TipoConvergencia.ts
export interface ITipoConvergenciaAttributes {
    id: number;
    descripcion: string;
    activo: 0 | 1;
  }
  
  // Para crear un TipoConvergencia: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface ITipoConvergenciaCreate {
    descripcion: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface ITipoConvergenciaUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por descripcion y estado
  export interface ITipoConvergenciaFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }