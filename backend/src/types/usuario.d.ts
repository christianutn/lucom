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
    activo: 0 | 1; // Por defecto 1 (activo)
}

// Para actualizar: todo opcional (no siempre vas a actualizar todo)

/**
 * Interface para actualizar un Usuario existente.
 * Todos los campos son opcionales, ya que no siempre vas a actualizar todo.
 * @property rol - Rol del usuario (VEND o ADM)
 * @property contrasena - Contraseña del usuario (opcional, si no se actualiza, se deja igual)
 * @property activo - Estado del usuario (1: activo, 0: inactivo)
 * @property nombre - Nombre del usuario (opcional)
 * @property apellido - Apellido del usuario (opcional)
 * @property correo_electronico - Correo electrónico del usuario (opcional)
 * @property empleado_id - ID del empleado asociado al usuario (opcional, si no se
 */
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