import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const TipoNegocio = sequelize.define('tipos_negocios', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    descripcion: { type: DataTypes.STRING(50), allowNull: false },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default TipoNegocio;
