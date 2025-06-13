import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";

const DetalleBaf = sequelize.define('detalles_baf', {
    venta_id: { type: DataTypes.INTEGER, primaryKey: true },
    tipos_domicilios_id: { type: DataTypes.INTEGER },
    abono_id: { type: DataTypes.INTEGER },
    TVHD: { type: DataTypes.TINYINT(1) },
    cantidad_decos: { type: DataTypes.INTEGER },
    horario_contacto: { type: DataTypes.STRING(150) },
    tipo_convergencia: { type: DataTypes.INTEGER }
}, { timestamps: false });

export default DetalleBaf;
