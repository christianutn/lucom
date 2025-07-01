// TipoDomicilio.ts
export interface ITipoDomicilioAttributes {
    id: number;
    descripcion: string;
    activo: 0 | 1;
  }
  
  // Para crear un TipoDomicilio: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface ITipoDomicilioCreate {
    descripcion: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface ITipoDomicilioUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por descripcion y estado
  export interface ITipoDomicilioFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }