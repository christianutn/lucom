import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IUsuarioAttributes, IUsuarioCreate } from "../types/usuario.d.js";

class Usuario extends Model<IUsuarioAttributes, IUsuarioCreate> implements IUsuarioAttributes {
    public empleado_id!: number;
    public rol!: string;
    public contrasena!: string;
    public activo!: 0 | 1;
}

Usuario.init(
    {
        empleado_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        rol: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contrasena: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "usuarios",
        timestamps: false, // No timestamps for this model
    }
);

export default Usuario;
