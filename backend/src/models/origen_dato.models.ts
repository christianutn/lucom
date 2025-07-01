import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IOrigenDatoAttributes, IOrigenDatoCreate, IOrigenDatoUpdate } from "../types/origen_dato.d.js";

class OrigenDato extends Model<IOrigenDatoAttributes, IOrigenDatoCreate> implements IOrigenDatoAttributes {
    public id!: number;
    public descripcion!: string;
    public activo!: 0 | 1;
}



OrigenDato.init(
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
        tableName: "origenes_datos",
        timestamps: false, // Si no necesitas createdAt y updatedAt
    }
);
export default OrigenDato;
