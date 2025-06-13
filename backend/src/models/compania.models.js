import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const Compania = sequelize.define('companias', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    descripcion: { type: DataTypes.STRING(45) },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default Compania;
