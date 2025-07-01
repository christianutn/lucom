import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IDetallePortaAttributes, IDetallePortaCreate } from "../types/detallePorta.d.js";


class DetallePorta extends Model<IDetallePortaAttributes, IDetallePortaCreate> implements IDetallePortaAttributes {
    public venta_id!: number;  // Identificador de la venta
    public NIM_a_portar!: string;  // Número de identificación móvil a portar
    public gigas!: number;  // Cantidad de gigas
    public compania!: number;  // Compañía a la que se portará
}

DetallePorta.init({
    venta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    NIM_a_portar: {
        type: DataTypes.STRING,
        allowNull: false
    },
  
    gigas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    compania: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'detalles_porta',
    timestamps: false
});


export default DetallePorta;
