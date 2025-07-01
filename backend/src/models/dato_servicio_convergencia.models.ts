import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/base_datos.js";
import { IDatosServicioConvergenciaAttributes } from "../types/dato_servicio_convergencia.d.js";

interface DatosServiciosConvergenciasCreationAttributes extends Optional<IDatosServicioConvergenciaAttributes, 'id' | 'activo'> {}

class DatosServiciosConvergencias extends Model<IDatosServicioConvergenciaAttributes, DatosServiciosConvergenciasCreationAttributes> implements IDatosServicioConvergenciaAttributes {
    public id!: number;  // Identificador único del servicio de convergencia
    public descripcion!: string;  // Descripción del servicio de convergencia
    public activo!: 1 | 0;  // Indica si el servicio de convergencia esta activo
}


DatosServiciosConvergencias.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false  // Obligatorio, no puede ser nulo
    },
    activo: {
        type: DataTypes.TINYINT,
        defaultValue: 1,  // Valor por defecto si no se especifica
        allowNull: true   // También permitimos que sea nulo explícitamente
    }
}, {
    sequelize,
    tableName: 'datos_servicios_convergencias',
    timestamps: false
});

export default DatosServiciosConvergencias;
