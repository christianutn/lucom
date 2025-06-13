// manejerValidacionErrores.js
import { validationResult } from 'express-validator';
import AppError from '../utils/appError.js'; // Asegúrate de que esta clase exista y sea compatible

const manejerValidacionErrores = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Mapea los errores de express-validator a un formato más limpio y consistente
        const detailedErrors = errors.array().map(err => ({
            field: err.path, // 'path' es generalmente el nombre del campo que falló. 'param' es un alias obsoleto.
            message: err.msg,
            location: err.location,
            value: err.value // El valor que causó el error, útil para depuración
        }));

        // Crea una instancia de AppError.
        // El mensaje principal de AppError puede ser genérico,
        // ya que los detalles se pasarán por separado.
        const validationError = new AppError(
            'Errores de validación en los datos de entrada.', // Mensaje genérico para el AppError
            400 // Código de estado Bad Request
        );

        // Adjunta el array de errores detallados a una propiedad personalizada del AppError.
        // Esto es crucial para que tu manejador de errores global pueda acceder a ellos.
        validationError.validationErrors = detailedErrors;

        // Opcionalmente, puedes añadir una bandera para identificar este tipo de error
        validationError.isValidationError = true;

        // Pasa el error al siguiente middleware en la cadena (tu manejador de errores global)
        return next(validationError);
    }

    // Si no hay errores de validación, continúa con el siguiente middleware/ruta
    next();
};

export default manejerValidacionErrores;