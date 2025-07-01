// Domicilio.ts
export interface IDomicilioAttributes {
    id: number;
    cliente_id: number;
    nombre_calle: string;
    numero_calle: string;
    entre_calle_1: string;
    entre_calle_2: string;
    barrio_id: number;
    activo: number;
    piso: number;
    departamento: string;
  }
  
  // Para crear un Domicilio: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IDomicilioCreate {
    cliente_id: number;
    nombre_calle: string;
    numero_calle: string;
    entre_calle_1?: string;
    entre_calle_2?: string;
    barrio_id: number;
    piso?: number;
    departamento?: string;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IDomicilioUpdate {
    cliente_id?: number;
    nombre_calle?: string;
    numero_calle?: string;
    entre_calle_1?: string;
    entre_calle_2?: string;
    barrio_id?: number;
    piso?: number;
    departamento?: string;
    activo?: number;
  }
  
  // Para filtros en el GET: podrías filtrar por nombre y estado
  export interface IDomicilioFilter {
    cliente_id?: number;
    nombre_calle?: string;
    numero_calle?: string;
    entre_calle_1?: string;
    entre_calle_2?: string;
    barrio_id?: number;
    piso?: number;
    departamento?: string;
  }