import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const TipoDocumento = sequelize.define('tipos_documentos', {
    codigo: { type: DataTypes.INTEGER, primaryKey: true },
    descripcion: { type: DataTypes.STRING(45) },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default TipoDocumento;
