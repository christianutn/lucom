import { Sequelize } from "sequelize";
import 'dotenv/config';
import AppError from "../utils/appError.js";

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
} = process.env;

// Verifica que las variables de entorno estén definidas
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
  throw new AppError("Faltan variables de entorno para la conexión a la base de datos", 500);
}

const sequelize  = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: parseInt(DB_PORT, 10), // Asegúrate de que el puerto sea un número
  dialectOptions: {
    ssl: {
      require: true, // Requiere SSL para la conexión
      rejectUnauthorized: false // Permitir conexiones SSL no autorizadas
    }
  },
  define: {
    freezeTableName: true // Evitar la pluralización automática del nombre de la tabla
  }
});


export default sequelize;

