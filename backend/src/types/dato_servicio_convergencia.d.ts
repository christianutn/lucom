// DatosServicioConvergencia.ts
export interface IDatosServicioConvergenciaAttributes {
    id: number;
    descripcion: string;
    activo: 1 | 0;
  }
  
  // Para crear un DatosServicioConvergencia: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IDatosServicioConvergenciaCreate {
    descripcion: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IDatosServicioConvergenciaUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por nombre y estado
  export interface IDatosServicioConvergenciaFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }