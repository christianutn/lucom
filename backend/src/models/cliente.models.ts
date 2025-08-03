import { DataTypes, Optional, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IClienteAttributes, IClienteCreate } from "../types/cliente.d.js";



class Cliente extends Model<IClienteAttributes, IClienteCreate> implements IClienteAttributes {
    public id!: number;
    public tipo_documento!: number;
    public numero_documento!: string;
    public nombre!: string;
    public apellido!: string;
    public fecha_nacimiento!: string;
    public telefono_secundario!: string;
    public activo!: 1 | 0;
    public correo_electronico!: string;
    public telefono_principal!: string;
}

/**
 * @description Esquema de la tabla "clientes"
 * @param id - ID del cliente
 * @param tipo_documento - Tipo de documento
 * @param numero_documento - Número de documento
 * @param nombre - Nombre del cliente
 * @param apellido - Apellido del cliente
 * @param fecha_nacimiento - Fecha de nacimiento del cliente
 * @param telefono_secundario - Teléfono secundario del cliente
 * @param activo - Estado del cliente (1: activo, 0: inactivo)
 * @param correo_electronico - Correo electrónico del cliente
 * @param telefono_principal - Telefono principal (OBligatorio)
 * 
 */

Cliente.init({
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    tipo_documento: { 
        type: DataTypes.STRING(50),
        allowNull: false  // Obligatorio, no puede ser nulo
    },
    numero_documento: { 
        type: DataTypes.STRING(20),
        allowNull: false   // Obligatorio, no puede ser nulo
    },
    nombre: { 
        type: DataTypes.STRING(50),
        allowNull: false  // Obligatorio, no puede ser nulo
    },
    apellido: { 
        type: DataTypes.STRING(50),
        allowNull: false  // Obligatorio, no puede ser nulo
    },
    fecha_nacimiento: { 
        type: DataTypes.DATEONLY,
        allowNull: true   // Opcional, puede ser nulo
    },
    telefono_secundario: { 
        type: DataTypes.STRING(20),
        allowNull: true   // Opcional, puede ser nulo
    },
    correo_electronico: { 
        type: DataTypes.STRING(100),
        allowNull: false   // obligatorio
    },
    activo: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,  // Valor por defecto si no se especifica
        allowNull: true   // También permitimos que sea nulo explícitamente
    },
    telefono_principal: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'clientes',
    timestamps: false // Correcto: Coincide con la ausencia de createdAt/updatedAt en la clase
});

export default Cliente;
