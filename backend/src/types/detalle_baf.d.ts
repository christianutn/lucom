// DatalleBaf.ts
export interface IDatalleBafAttributes {
    venta_id: number;
    tipos_domicilios_id: number;
    abono_id: number;
    TVHD: 1 | 0;
    cantidad_decos: number;
    horario_contacto: string;
    tipo_convergencia_id: number;
  }
  
  // Para crear un DatalleBaf: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IDatalleBafCreate {
    venta_id: number;
    tipos_domicilios_id: number;
    abono_id: number;
    TVHD: 1 | 0;
    cantidad_decos: number;
    horario_contacto: string;
    tipo_convergencia_id: number;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IDatalleBafUpdate {
    tipos_domicilios_id?: number;
    abono_id?: number;
    TVHD?: 1 | 0;
    cantidad_decos?: number;
    horario_contacto?: string;
    tipo_convergencia_id?: number;
  }
  
  // Para filtros en el GET: podrías filtrar por nombre y estado
  export interface IDatalleBafFilter {
    descripcion?: string;
    activo?: 1 | 0;
  }