import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const Empleado = sequelize.define('empleados', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    apellido: { type: DataTypes.STRING(50), allowNull: false },
    correo_electronico: { type: DataTypes.STRING(100), allowNull: false },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default Empleado;
