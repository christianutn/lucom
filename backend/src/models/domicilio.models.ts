import { DataTypes, Model } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IDomicilioAttributes, IDomicilioCreate } from "../types/domicilio.d.js"; // Import types if needed

class Domicilio extends Model<IDomicilioAttributes, IDomicilioCreate> implements IDomicilioAttributes {
    public id!: number;
    public cliente_id!: number;
    public nombre_calle!: string;
    public numero_calle!: string;
    public entre_calle_1!: string;
    public entre_calle_2!: string;
    public barrio_id!: number;
    public activo!: number;
    public piso!: number;
    public departamento!: string;
}


Domicilio.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_calle: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    numero_calle: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    entre_calle_1: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    entre_calle_2: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    barrio_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    activo: {
        type: DataTypes.INTEGER,
        defaultValue: 1 // 1 for active, 0 for inactive
    },
    piso: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    departamento: {
        type: DataTypes.STRING(2),
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'domicilios',
    timestamps: false, // Adds createdAt and updatedAt fields
});

export default Domicilio;