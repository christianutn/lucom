import { DataTypes, Optional, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IClienteAttributes, IClienteCreate, IClienteFilter, IClienteUpdate } from "../types/cliente.d.js";

interface ClienteCreationAttributes extends Optional<IClienteAttributes, 'id' | 'activo' | 'telefono_secundario' | 'fecha_nacimiento' | 'correo_electronico'> {}


class Cliente extends Model<IClienteAttributes, ClienteCreationAttributes> implements IClienteAttributes {
    public id!: number;
    public tipo_documento!: number;
    public numero_documento!: string;
    public nombre!: string;
    public apellido!: string;
    public fecha_nacimiento!: string;
    public telefono_secundario!: string;
    public activo!: 1 | 0;
    public correo_electronico!: string;
}


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
        allowNull: true   // Opcional, puede ser nulo
    },
    activo: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,  // Valor por defecto si no se especifica
        allowNull: true   // También permitimos que sea nulo explícitamente
    }
}, {
    sequelize,
    tableName: 'clientes',
    timestamps: false // Correcto: Coincide con la ausencia de createdAt/updatedAt en la clase
});

export default Cliente;
