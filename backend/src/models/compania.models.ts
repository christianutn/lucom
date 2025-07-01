import { DataTypes, Optional, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { ICompaniaAttributes } from "../types/compania.d.js";

interface CompaniaCreationAttributes extends Optional<ICompaniaAttributes, 'id'> {}

class Compania extends Model<ICompaniaAttributes, CompaniaCreationAttributes> implements ICompaniaAttributes {
    public id!: number;
    public descripcion!: string;
    public activo!: 1 | 0;
}

Compania.init({
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
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    sequelize,
    tableName: 'companias',
    timestamps: false
});

export default Compania;
