import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const Cliente = sequelize.define('clientes', {
    tipo_documento: { type: DataTypes.INTEGER, primaryKey: true },
    numero_documento: { type: DataTypes.STRING(15), primaryKey: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    apellido: { type: DataTypes.STRING(50), allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATE },
    telefono_secundario: { type: DataTypes.STRING(20) },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 }
}, { timestamps: false });

export default Cliente;
