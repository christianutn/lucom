// Barrio.ts
export interface IBarrioAttributes {
    id: number;
    nombre: string;
    codigo_postal: string;
    activo: 0 | 1;
  }
  
  // Para crear un barrio: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IBarrioCreate {
    nombre: string;
    codigo_postal?: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IBarrioUpdate {
    nombre?: string;
    activo?: 1 | 0;
    codigo_postal?: string;
  }
  
  // Para filtros en el GET: podrías filtrar por nombre y estado
  export interface IBarrioFilter {
    nombre?: string;
    activo?: 1 | 0;
    codigo_postal?: string;
  }