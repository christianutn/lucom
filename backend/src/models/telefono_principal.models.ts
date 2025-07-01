import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { ITelefonoPrincipalAttributes, ITelefonoPrincipalCreate } from "../types/telefono_principal.d.js";


class TelefonoPrincipal extends Model<ITelefonoPrincipalAttributes, ITelefonoPrincipalCreate> implements ITelefonoPrincipalAttributes {
    public id!: number;
    public cliente_id!: number;
    public numero_telefono!: string;
    public fecha_modificacion!: Date;
    public activo!: 1 | 0;
}

TelefonoPrincipal.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_modificacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    activo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }
}, {
    sequelize,
    tableName: 'telefonos_principales',
    timestamps: false // No timestamps for this model
   
})

export default TelefonoPrincipal;
