// OrigenDato.ts
export interface IOrigenDatoAttributes {
    id: number;
    descripcion: string;
    activo: 0 | 1;
  }
  
  // Para crear un OrigenDato: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IOrigenDatoCreate {
    descripcion: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IOrigenDatoUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por descripcion y estado
  export interface IOrigenDatoFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }