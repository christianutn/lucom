import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const DetallePorta = sequelize.define('detalles_porta', {
    venta_id: { type: DataTypes.INTEGER, primaryKey: true },
    NIM_a_portar: { type: DataTypes.STRING(15), allowNull: false },
    gigas: { type: DataTypes.INTEGER },
    compania: { type: DataTypes.INTEGER }
}, { timestamps: false });

export default DetallePorta;
