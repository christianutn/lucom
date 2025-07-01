// TelefonoPrincipal.ts
//Importar clase datatime de luxon
export interface ITelefonoPrincipalAttributes {
    id: number;
    cliente_id: number;
    numero_telefono: string;
    fecha_modificacion: Date;
    activo: 1 | 0;
  }
  
  // Para crear un TelefonoPrincipal: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface ITelefonoPrincipalCreate {
    cliente_id: number;
    numero_telefono: string;
    fecha_modificacion: Date;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface ITelefonoPrincipalUpdate {
    cliente_id?: number;
    numero_telefono?: string;
    fecha_modificacion: Date;
    activo?: 1 | 0;
  }
  
  // Para filtros en el GET: podrías filtrar por descripcion y estado
  export interface ITelefonoPrincipalFilter {
    cliente_id?: number;
    numero_telefono?: string;
    activo?: 1 | 0;
  }