import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const Domicilio = sequelize.define('domicilios', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo_documento_cliente: { type: DataTypes.INTEGER },
    numero_documento_cliente: { type: DataTypes.STRING(20) },
    nombre_calle: { type: DataTypes.STRING(150), allowNull: false },
    numero_calle: { type: DataTypes.STRING(15), allowNull: false },
    entre_calle_1: { type: DataTypes.STRING(150) },
    entre_calle_2: { type: DataTypes.STRING(150) },
    barrio: { type: DataTypes.INTEGER, allowNull: false },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default Domicilio;
