import { DataTypes, Model } from "sequelize";
import { ITipoDomicilioAttributes, ITipoDomicilioCreate, ITipoDomicilioUpdate } from "../types/tipo_domicilio.d.js";
import sequelize from "../config/base_datos.js";

class TipoDomicilio extends Model<ITipoDomicilioAttributes, ITipoDomicilioCreate> implements ITipoDomicilioAttributes {
    public id!: number;
    public descripcion!: string;
    public activo!: 0 | 1;
}

TipoDomicilio.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        descripcion: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        activo: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1, // 1 for active, 0 for inactive
        },
    },
    {
        sequelize,
        tableName: "tipos_domicilios",
        timestamps: false, // Assuming you don't need createdAt/updatedAt fields
    }
);
export default TipoDomicilio;
