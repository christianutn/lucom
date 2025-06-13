import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const TipoDomicilio = sequelize.define('tipos_domicilios', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    descripcion: { type: DataTypes.STRING(45), allowNull: false },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default TipoDomicilio;
