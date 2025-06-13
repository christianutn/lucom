import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const TelefonoPrincipal = sequelize.define('telefonos_principales', {
    tipo_documento: { type: DataTypes.INTEGER, primaryKey: true },
    numero_documento: { type: DataTypes.STRING(15), primaryKey: true },
    numero_telefono: { type: DataTypes.STRING(20), primaryKey: true },
    fecha_modificacion: { type: DataTypes.DATE, allowNull: false },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default TelefonoPrincipal;
