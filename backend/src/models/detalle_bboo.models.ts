import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IDetalleBbooAttributes, IDetalleBbooCreate} from "../types/detalle_bboo.d.js";

class DetalleBboo extends Model<IDetalleBbooAttributes, IDetalleBbooCreate> implements IDetalleBbooAttributes {
    venta_id!: number;
    tipos_domicilios_id!: number;
    linea_claro_a_consultar!: string;
    pedido_rellamado!: string;
}

DetalleBboo.init({
    venta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    tipos_domicilios_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    linea_claro_a_consultar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pedido_rellamado: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
}, {
    sequelize,
    tableName: 'detalles_bboo',
    timestamps: false
});


export default DetalleBboo;
