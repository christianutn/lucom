import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IConsultaBbooAttributes, IConsultaBbooCreate} from "../types/consultas_bboo.js";

class ConsultaBboo extends Model<IConsultaBbooAttributes, IConsultaBbooCreate> implements IConsultaBbooAttributes {
    id!: number;
    tipos_domicilios_id!: number;
    linea_claro_a_consultar!: string;
    pedido_rellamado!: string;
    cliente_id!: number;
    domicilio_id!: number;
}

ConsultaBboo.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    tipos_domicilios_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    linea_claro_a_consultar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pedido_rellamado: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    domicilio_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    
}, {
    sequelize,
    tableName: 'consultas_bboo',
    timestamps: false
});


export default ConsultaBboo;
