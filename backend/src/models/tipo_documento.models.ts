import { DataTypes, Model } from "sequelize";
import { ITipoDocumentoAttributes, ITipoDocumentoCreate, ITipoDocumentoUpdate } from "../types/tipo_documento.d.js";
import sequelize from "../config/base_datos.js";

class TipoDocumento extends Model<ITipoDocumentoAttributes, ITipoDocumentoCreate> implements ITipoDocumentoAttributes {
    public id!: number;
    public descripcion!: string;
    public activo!: 0 | 1;
}

TipoDocumento.init(
    {
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
    },
    {
        sequelize,
        tableName: 'tipos_documentos',
        timestamps: false, // Automatically adds createdAt and updatedAt fields
    }
)
export default TipoDocumento;
