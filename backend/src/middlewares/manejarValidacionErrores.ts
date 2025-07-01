import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError, Location, FieldValidationError, AlternativeValidationError } from 'express-validator';
import AppError from '../utils/appError.js';

/**
 * Define la estructura de un error de validación formateado para ser enviado en la respuesta.
 */
export interface FormattedValidationError {
    field: string;
    message: string;
    location: Location;
    value: any;
}

const manejarValidacionErrores = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const allErrors: ValidationError[] = errors.array();
        
        // Creamos un array para almacenar todos los errores de campo, ya sean directos o anidados.
        let detailedErrors: FormattedValidationError[] = [];

        allErrors.forEach(error => {
            // Caso 1: Es un error de campo directo (como los de body('cliente_id'))
            if (error.type === 'field') {
                // `error` ya es de tipo FieldValidationError aquí
                detailedErrors.push({
                    field: error.path,
                    message: error.msg,
                    location: error.location,
                    value: error.value,
                });
            } 
            // Caso 2: Es un error de `oneOf` (o `check()`) que agrupa otros errores.
            // Puede ser 'alternative' (si no se agruparon) o 'alternative_grouped'.
            else if (error.type === 'alternative' || error.type === 'alternative_grouped') {
                // Aquí usamos `(error as any)` o un type guard más específico porque
                // `nestedErrors` no está en el tipo base `ValidationError`.
                // Desempaquetamos los errores anidados de todas las alternativas que fallaron.
                const nestedErrors = (error as AlternativeValidationError).nestedErrors;
                
                // `nestedErrors` es un array de arrays. Lo aplanamos.
                const flatNestedErrors = nestedErrors.flat();

                flatNestedErrors.forEach(nestedErr => {
                    // Cada error anidado debería ser un FieldValidationError.
                    // Hacemos una comprobación para estar seguros.
                    if (nestedErr.type === 'field') {
                        detailedErrors.push({
                            field: nestedErr.path,
                            message: nestedErr.msg,
                            location: nestedErr.location,
                            value: nestedErr.value,
                        });
                    }
                });
            }
        });

        // (Opcional) Eliminar duplicados si un campo falla en múltiples validaciones.
        // Esto puede ser útil si un campo es validado como parte de `oneOf` y también por sí mismo.
        const uniqueDetailedErrors = detailedErrors.filter(
            (error, index, self) => index === self.findIndex(e => e.field === error.field && e.message === error.message)
        );

        const validationError = new AppError(
            'Errores de validación en los datos de entrada.',
            400
        );

        // Adjuntamos la lista de errores desempaquetados.
        validationError.validationErrors = uniqueDetailedErrors;
        validationError.isValidationError = true;

        return next(validationError);
    }

    next();
};

export default manejarValidacionErrores;