// backend/src/config/base_datos.ts

import { Sequelize } from "sequelize";
import 'dotenv/config';

// Leemos TODAS las variables de entorno que podríamos necesitar
const {
  NODE_ENV,
  // Variables para Producción (Cloud Run)
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_CONNECTION_NAME,
  
  // Variables para Desarrollo Local (tu PC)
  DB_NAME_LOCAL,
  DB_USER_LOCAL,
  DB_PASSWORD_LOCAL,
  DB_CONNECTION_NAME_LOCAL,
  DB_PORT_LOCAL
} = process.env;

let sequelize: Sequelize;

// Esta es la lógica clave: decidimos qué configuración usar
if (NODE_ENV === 'production') {
  // --- ESTAMOS EN PRODUCCIÓN (GOOGLE CLOUD RUN) ---
  console.log("🚀 Running in PRODUCTION mode. Connecting via Socket Path.");

  // Verificamos que las variables de producción existan
  if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_CONNECTION_NAME) {
    throw new Error("Missing production environment variables for database.");
  }

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
      socketPath: `/cloudsql/${DB_CONNECTION_NAME}` // Conexión segura por socket
    },
    define: {
      freezeTableName: true
    },
    logging: false // No mostramos las consultas SQL en los logs de producción
  });

} else {
  // --- ESTAMOS EN DESARROLLO (TU PC LOCAL) ---
  console.log("🛠️ Running in DEVELOPMENT mode. Connecting via TCP to localhost (Cloud SQL Proxy).");

  // Verificamos que las variables locales existan
  if (!DB_NAME_LOCAL || !DB_USER_LOCAL || !DB_PASSWORD_LOCAL || !DB_CONNECTION_NAME_LOCAL || !DB_PORT_LOCAL) {
    throw new Error("Missing local environment variables for database. Is your .env file correct?");
  }
  
  sequelize = new Sequelize(DB_NAME_LOCAL, DB_USER_LOCAL, DB_PASSWORD_LOCAL, {
    host: DB_CONNECTION_NAME_LOCAL, // Debe ser 'localhost' o '127.0.0.1'
    port: parseInt(DB_PORT_LOCAL, 10),
    dialect: 'mysql',
    define: {
      freezeTableName: true
    }
  });
}

export default sequelize;