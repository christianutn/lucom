// DetallePorta.ts
export interface IDetallePortaAttributes {
    venta_id: number;
    NIM_a_portar: string;
    gigas: number;
    compania: number;
  }
  
  // Para crear un DetallePorta: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
  export interface IDetallePortaCreate {
    venta_id: number;
    NIM_a_portar: string;
    gigas: number;
    compania: number;
  }
  
  // Para actualizar: todo opcional (no siempre vas a actualizar todo)
  export interface IDetallePortaUpdate {
    NIM_a_portar?: string;
    gigas?: number;
    compania?: number;
  }
  
  // Para filtros en el GET: podrías filtrar por nombre y estado
  export interface IDetallePortaFilter {
    venta_id?: number;
    NIM_a_portar?: string;
    gigas?: number;
    compania?: number;
  }