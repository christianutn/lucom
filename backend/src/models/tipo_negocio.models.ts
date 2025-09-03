import { DataTypes, Model } from "sequelize";
import { ITipoNegocioAttributes, ITipoNegocioCreate, ITipoNegocioUpdate } from "../types/tipo_negocio.d.js";
import sequelize from "../config/base_datos.js";

class TipoNegocio extends Model<ITipoNegocioAttributes, ITipoNegocioCreate> implements ITipoNegocioAttributes {
    public id!: number;
    public descripcion!: string;
    public activo!: 0 | 1;
}

TipoNegocio.init(
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
        tableName: "tipos_negocios",
        timestamps: false, // Assuming you don't need createdAt/updatedAt fields
    }
);

export default TipoNegocio;
