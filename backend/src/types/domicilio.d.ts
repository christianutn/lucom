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

  /**
   * Para crear un Domicilio:
   * @param cliente_id - El ID del cliente al que pertenece el domicilio.
   * @param nombre_calle - El nombre de la calle.
   * @param numero_calle - El número de la calle.
   * @param entre_calle_1 - El nombre de la calle entre calle 1.
   * @param entre_calle_2 - El nombre de la calle entre calle 2.
   * @param barrio_id - El ID del barrio al que pertenece el domicilio.
   * @param piso - El piso del domicilio (Opcional).
   * @param departamento - El departamento del domicilio (Opcional).
   */
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

  /**
   * Para actualizar un Domicilio:
   * @param cliente_id - El ID del cliente al que pertenece el domicilio.
   * @param nombre_calle - El nombre de la calle.
   * @param numero_calle - El número de la calle.
   * @param entre_calle_1 - El nombre de la calle entre calle 1.
   * @param entre_calle_2 - El nombre de la calle entre calle 2.
   * @param barrio_id - El ID del barrio al que pertenece el domicilio.
   * @param piso - El piso del domicilio (Opcional).
   * @param departamento - El departamento del domicilio (Opcional).  
   */
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