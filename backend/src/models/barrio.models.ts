import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/base_datos.js";
import {IBarrioAttributes, IBarrioCreate, IBarrioFilter, IBarrioUpdate} from "../types/barrio.d.js"

interface BarrioCreationAttributes extends Optional<IBarrioAttributes, 'id' | 'codigo_postal' | 'activo'> {}


class Barrio extends Model<IBarrioAttributes, BarrioCreationAttributes> implements IBarrioAttributes {
    public id!: number;  // Identificador único del barrio
    public nombre!: string;  // Nombre del barrio, obligatorio
    public codigo_postal!: string | "";  // Código postal, opcional
    public activo!: 0 | 1;  // Estado del barrio, por defecto activo (1)

    // Timestamps no son necesarios ya que no se usan createdAt/updatedAt
}

Barrio.init({
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    nombre: { 
        type: DataTypes.STRING(150),
        allowNull: false  // Obligatorio, no puede ser nulo
    },
    codigo_postal: { 
        type: DataTypes.STRING(10),
        allowNull: true   // Opcional, puede ser nulo
    },
    activo: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,  // Valor por defecto si no se especifica
        allowNull: true   // También permitimos que sea nulo explícitamente
    }
}, {
    sequelize,
    tableName: 'barrios',
    timestamps: false // Correcto: Coincide con la ausencia de createdAt/updatedAt en la clase
});

export default Barrio;