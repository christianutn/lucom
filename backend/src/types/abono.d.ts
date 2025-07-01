// Abono.ts
export interface IAbonoAttributes {
    id: number;
    descripcion: string;
    activo: 0 | 1;
  }
  
  // Para crear un Abono: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IAbonoCreate {
    descripcion: string;
    codigo_postal: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IAbonoUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por descripcion y estado
  export interface IAbonoFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }