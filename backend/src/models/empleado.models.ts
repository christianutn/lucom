import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IEmpleadoAttributes, IEmpleadoCreate, IEmpleadoUpdate } from "../types/empleado.d.js";


class Empleado extends Model<IEmpleadoAttributes, IEmpleadoCreate> implements IEmpleadoAttributes {
    public id!: number;
    public nombre!: string;
    public apellido!: string;
    public correo_electronico!: string;
    public activo!: 1 | 0;
}


Empleado.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        correo_electronico: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        activo: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1, // 1 for active, 0 for inactive
        },
    },
    {
        sequelize,
        tableName: "empleados",
        timestamps: false, // Agrega createdAt y updatedAt
    }
);

export default Empleado;
