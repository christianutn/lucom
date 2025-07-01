// TipoDocumento.ts
export interface ITipoDocumentoAttributes {
    id: number;
    descripcion: string;
    activo: 0 | 1;
  }
  
  // Para crear un TipoDocumento: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface ITipoDocumentoCreate {
    descripcion: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface ITipoDocumentoUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por descripcion y estado
  export interface ITipoDocumentoFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }