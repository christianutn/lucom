// Giga.ts
export interface IGigaAttributes {
    id: number;
    descripcion: string;
    activo: 0 | 1;
  }
  
  // Para crear un Giga: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IGigaCreate {
    descripcion: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IGigaUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por descripcion y estado
  export interface IGigaFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }