import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const TelefonoPrincipal = sequelize.define('telefonos_principales', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cliente_id: { type: DataTypes.INTEGER, allowNull: false },
    numero_telefono: { type: DataTypes.STRING(20)},
    fecha_modificacion: { type: DataTypes.DATE, allowNull: false },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default TelefonoPrincipal;
