import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { ITipoConvergenciaAttributes, ITipoConvergenciaCreate } from "../types/tipo_convergencia.d.js";

class TipoConvergencia extends Model<ITipoConvergenciaAttributes, ITipoConvergenciaCreate> implements ITipoConvergenciaAttributes {
    public id!: number;
    public descripcion!: string;
    public activo!: 0 | 1;
}

TipoConvergencia.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    activo: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1, // 1 for active, 0 for inactive
    }
}, {
    sequelize,
    tableName: 'tipos_convergencias',
    timestamps: false, // Automatically adds createdAt and updatedAt fields
})
export default TipoConvergencia;
