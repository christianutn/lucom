import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const TipoConvergencia = sequelize.define('tipos_convergencias', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    descripcion: { type: DataTypes.STRING(100), allowNull: false },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default TipoConvergencia;
