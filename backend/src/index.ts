// backend\src\index.js

import express from "express";
import indexRoutes from "./routes/index.routes.js";
import cors from "cors";
import sequelize from "./config/base_datos.js";
import "./models/asociaciones.models.js";
import 'dotenv/config';
import passport from "passport";
import inicializarPassport from "./config/passport.js";
import manejadorGlobalErrores from "./middlewares/manejadorGlobalErrores.js";
import AppError from "./utils/appError.js";
import { Request, Response, NextFunction } from "express";

const app = express();
const PORT =  8080;

export const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        await sequelize.sync({ alter: false });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

// Middlewares
app.use(cors());
app.use(express.json());

// Inicialización de Passport
inicializarPassport();
app.use(passport.initialize());

// Rutas
app.use("/api", indexRoutes);

// Endpoint de prueba
app.get("/api/ping", (req, res) => {
    const responseData = {
        message: "El backend está escuchando.",
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
    };
    res.status(200).json(responseData);
});

// Middleware para manejar rutas no encontradas
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
});

// Middleware para manejar errores generales
app.use(manejadorGlobalErrores);

// Exportar la app para los tests
export { app };

const startServer = async () => {
    try {
        await initDb();
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        }
    } catch (error) {
        console.error("Failed to initialize database or start server:", error);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
        // Si estamos en test y falla initDb, el error se propagará y el test fallará, lo cual es bueno.
    }
};

// Iniciar el servidor.
// La lógica para no iniciar en 'test' está dentro de startServer.
startServer();