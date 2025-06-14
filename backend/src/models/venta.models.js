import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const Venta = sequelize.define('ventas', {
    id:
        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    comentario_horario_contacto:
        { type: DataTypes.STRING(150) },
    convergencia:
        { type: DataTypes.TINYINT(1) },
    tipo_negocio_id:
        { type: DataTypes.INTEGER },
    fecha_realizacion:
        { type: DataTypes.DATE, allowNull: false },
    activo:
        { type: DataTypes.TINYINT(1), defaultValue: 1 },
    numero_documento_cliente: {
        type: DataTypes.STRING(15),
 

    },
    tipo_documento_cliente: {
        type: DataTypes.INTEGER,
     
    }
}, { timestamps: false });

export default Venta;
