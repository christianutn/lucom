import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const Rol = sequelize.define('roles', {
    codigo: { type: DataTypes.STRING(10), primaryKey: true },
    descripcion: { type: DataTypes.STRING(45), allowNull: false },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default Rol;
