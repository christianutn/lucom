import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const Cliente = sequelize.define('clientes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipo_documento: { type: DataTypes.INTEGER, allowNull: false },
    numero_documento: { type: DataTypes.STRING(15), allowNull: false },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    apellido: { type: DataTypes.STRING(50), allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATE },
    telefono_secundario: { type: DataTypes.STRING(20) },
    activo: { type: DataTypes.TINYINT(1), defaultValue: 1 },
    correo_electronico: { type: DataTypes.STRING(100) }
}, { timestamps: false });

export default Cliente;
