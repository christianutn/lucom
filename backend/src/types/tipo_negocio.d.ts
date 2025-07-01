// TipoNegocio.ts
export interface ITipoNegocioAttributes {
    id: number;
    descripcion: string;
    activo: 0 | 1;
  }
  
  // Para crear un TipoNegocio: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface ITipoNegocioCreate {
    descripcion: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface ITipoNegocioUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por descripcion y estado
  export interface ITipoNegocioFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }