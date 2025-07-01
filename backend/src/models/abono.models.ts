import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IAbonoAttributes, IAbonoCreate, IAbonoFilter, IAbonoUpdate } from "../types/abono.d.js";


interface AbonoCreationAttributes extends Optional<IAbonoAttributes, 'id' | 'activo'> {}


class Abono extends Model<IAbonoAttributes, AbonoCreationAttributes> implements IAbonoAttributes {
    public id!: number;  // Identificador único del Abono
    public descripcion!: string;  // Nombre del Abono, obligatorio
    public activo!: 0 | 1;  // Estado del Abono, por defecto activo (1)

    // Timestamps no son necesarios ya que no se usan createdAt/updatedAt
}


Abono.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    activo: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1
    }
}, {
    sequelize,
    tableName: 'abonos',
    timestamps: false
});

export default Abono;