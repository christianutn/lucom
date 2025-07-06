// Usuario.ts
export interface IUsuarioAttributes {
    empleado_id: number;
    rol: string;
    contrasena: string;
    activo: 0 | 1;
}

// Para crear un Usuario: name es obligatorio, isActive opcional (por defecto true, por ejemplo)
export interface IUsuarioCreate {
    empleado_id: number;
    rol: string;
    contrasena: string;
}

// Para actualizar: todo opcional (no siempre vas a actualizar todo)
export interface IUsuarioUpdate {
    rol?: string;
    contrasena?: string;
    activo?: 0 | 1;
}

// Para filtros en el GET: podrías filtrar por descripcion y estado
export interface IUsuarioFilter {
    activo?: 1 | 0;
    rol?: string
}

/**
 * Interface para actualizar una Venta existente.
 * Todos los campos son obligatorios
 * @property empleado_id - ID del empleado
 * @property rol - Rol del empleado
 * @property activo - Estado del empleado (1: activo, 0: inactivo)
 * @property nombre - Nombre del empleado
 * @property apellido - Apellido del empleado
 */

export interface IUserInRequest {
    empleado_id: number;
    rol: string;
    activo: 0 | 1;
    nombre: string; 
    apellido: string; 
}