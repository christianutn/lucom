import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const Usuario = sequelize.define('usuarios', {
    empleado_id: { type: DataTypes.INTEGER, primaryKey: true },
    rol: { type: DataTypes.STRING(45), allowNull: false },
    contrasena: { type: DataTypes.STRING(200), allowNull: false },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default Usuario;
