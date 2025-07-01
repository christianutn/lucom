import { DataTypes, Model} from "sequelize";
import sequelize from "../config/base_datos.js";
import { IRolAttributes, IRolCreate, IRolUpdate } from "../types/rol.d.js";

class Rol extends Model<IRolAttributes, IRolCreate> implements IRolAttributes {
    public codigo!: number;
    public descripcion!: string;
    public activo!: 0 | 1;
}

Rol.init(
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        activo: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1, // 1 para activo, 0 para inactivo
        },
    },
    {
        sequelize,
        tableName: "roles",
        timestamps: false, // Si no necesitas createdAt y updatedAt
    }
);

export default Rol;
