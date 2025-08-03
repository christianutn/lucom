import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IVentaAttributes, IVentaCreate } from "../types/venta.js";


class Venta extends Model<IVentaAttributes, IVentaCreate> implements IVentaAttributes {
    public id!: number;
    public comentario_horario_contacto!: string;
    public tipo_negocio_id!: number;
    public fecha_realizacion!: Date;
    public activo!: 1 | 0;
    public cliente_id!: number;
    public domicilio_id!: number;
    public empleado_id!: number;
    public origen_dato_id!: number;
}

Venta.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        comentario_horario_contacto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo_negocio_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fecha_realizacion: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        activo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1, // Assuming 1 means active
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        domicilio_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        empleado_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        origen_dato_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "ventas",
        timestamps: false,
    }
);

export default Venta;
