// utils/appError.ts

/**
 * Interfaz opcional para describir la estructura de un error de validación.
 * Podés adaptarla según cómo quieras estructurar los errores de validación.
 */
export interface ValidationErrorItem {
    field: string;
    message: string;
    [key: string]: any; // Si querés permitir campos adicionales
}

/**
 * Clase personalizada para manejar errores operacionales de la aplicación.
 * Permite definir un mensaje, un código de estado HTTP y marcar si es un error operacional.
 */
class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    validationErrors?: ValidationErrorItem[];
    isValidationError?: boolean;

    /**
     * Crea una instancia de AppError.
     * @param message - El mensaje de error que se mostrará.
     * @param statusCode - El código de estado HTTP para la respuesta.
     * @param validationErrors - Opcional. Un array de objetos con detalles de errores de validación.
     */
    constructor(message: string, statusCode: number, validationErrors?: ValidationErrorItem[]) {
        // Llama al constructor de la clase padre (Error) y le pasa el mensaje.
        super(message);

        // Propiedades personalizadas
        this.statusCode = statusCode;

        // Determina el 'status' basado en el statusCode:
        // 'fail' para errores del cliente (4xx), 'error' para errores del servidor (5xx).
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Marca este error como un error operacional.
        this.isOperational = true;

        // Almacena los errores de validación si se proporcionan
        if (validationErrors) {
            this.validationErrors = validationErrors;
            this.isValidationError = true; // Bandera para identificar que es error de validación
        }

        // Captura el stack trace, excluyendo el constructor actual
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
