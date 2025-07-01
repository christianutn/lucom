// Venta.ts
export interface IVentaAttributes {
    id: number;
    comentario_horario_contacto: string;
    convergencia: 1 | 0;
    tipo_negocio_id: number;
    fecha_realizacion: Date;
    activo: 1 | 0;
    cliente_id: number;
    domicilio_id: number;
  }
  
  // Para crear un Venta: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IVentaCreate {
    comentario_horario_contacto: string;
    convergencia: 1 | 0;
    tipo_negocio_id: number;
    fecha_realizacion: Date;
    cliente_id: number;
    domicilio_id: number;
    
  }
  
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IVentaUpdate {
    comentario_horario_contacto?: string;
    convergencia?: 1 | 0;
    tipo_negocio_id?: number;
    fecha_realizacion?: Date;
    activo?: 1 | 0;
    domicilio_id?: number;
  }
  
  