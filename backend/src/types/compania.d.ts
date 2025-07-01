// Compania.ts
export interface ICompaniaAttributes {
    id: number;
    descripcion: string;
    activo: 1 | 0;
  }
  
  // Para crear un Compania: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface ICompaniaCreate {
    descripcion: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface ICompaniaUpdate {
    descripcion?: string;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por nombre y estado
  export interface ICompaniaFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }