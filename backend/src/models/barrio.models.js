import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const Barrio = sequelize.define('barrios', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(150) },
    codigo_postal: { type: DataTypes.STRING(10) },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default Barrio;
