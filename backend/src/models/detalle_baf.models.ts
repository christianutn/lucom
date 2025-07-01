import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IDatalleBafAttributes, IDatalleBafCreate} from "../types/detalle_baf.d.js";

class DetalleBaf extends Model<IDatalleBafAttributes, IDatalleBafCreate> implements IDatalleBafAttributes {
    public venta_id!: number;  // Identificador de la venta
    public tipos_domicilios_id!: number;  // Identificador del tipo de domicilio
    public abono_id!: number;  // Identificador del abono
    public TVHD!: 1 | 0;  // Indica si es TVHD (1) o no (0)
    public cantidad_decos!: number;  // Cantidad de decodificadores
    public horario_contacto!: string;  // Horario de contacto
    public tipo_convergencia_id!: number;  // Identificador del tipo de convergencia
}

DetalleBaf.init({
    venta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    tipos_domicilios_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    abono_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TVHD: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad_decos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    horario_contacto: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    tipo_convergencia_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'detalles_baf',
    timestamps: false
});


export default DetalleBaf;
