import { DataTypes } from "sequelize";
import sequelize from "../config/base_datos.js";


const Abono = sequelize.define('abonos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    activo: {
        type: DataTypes.TINYINT(1), // Cambiado a TINYINT(1) para coincidir con MySQL
        allowNull: true,
        defaultValue: 1
    }
}, {
    timestamps: false
});



export default Abono;