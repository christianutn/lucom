import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IGigaAttributes, IGigaCreate } from "../types/gigas.js";

class Giga extends Model<IGigaAttributes, IGigaCreate> implements IGigaAttributes {
    public id!: number;
    public descripcion!: string;
    public activo!: 0 | 1;

}


Giga.init(
    {
        id: {
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
        tableName: "gigas",
        timestamps: false, // Si no necesitas createdAt y updatedAt
    }
);
export default Giga;
