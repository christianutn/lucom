import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const DatosServiciosConvergencias = sequelize.define('datos_servicios_convergencias', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descripcion: { type: DataTypes.STRING(45) },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default DatosServiciosConvergencias;
