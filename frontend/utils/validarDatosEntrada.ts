/**
 * Valida un nombre o apellido para asegurar que no contenga números y que
 * esté compuesto por caracteres alfabéticos de diversos idiomas,
 * permitiendo también espacios, apóstrofes y guiones.
 *
 * @param nombre El nombre o apellido a validar.
 * @returns `true` si el nombre es válido, `false` en caso contrario.
 */
export const validarNombreApellido = (nombre: string): boolean => {
  if (!nombre || nombre.trim().length === 0) {
    return false;
  }

  // Expresión regular para validar nombres internacionales.
  // \p{L} - Coincide con cualquier letra de cualquier idioma.
  // \s - Coincide con espacios en blanco.
  // ' - Coincide con el apóstrofe.
  // - - Coincide con el guión.
  // El flag 'u' es para habilitar el soporte completo de Unicode.
  const regex = /^[\p{L}\s'-]+$/u;

  return regex.test(nombre);
};


/**
 * Valida un número de CUIT argentino sin guiones.
 *
 * La validación consta de dos partes:
 * 1.  Verifica que el CUIT tenga exactamente 11 dígitos numéricos.
 * 2.  Calcula y compara el dígito verificador según el algoritmo de la AFIP.
 *
 * @param cuit El número de CUIT a validar como una cadena de 11 dígitos.
 * @returns `true` si el CUIT es válido, `false` en caso contrario.
 */
export const validarCuit = (cuit: string): boolean => {
  // 1. Verificación de formato con expresión regular
  const regex = /^\d{11}$/;
  if (!regex.test(cuit)) {
    return false;
  }

  // 2. Cálculo del dígito verificador
  const cuitArray = cuit.split('').map(Number);
  const digitoVerificador = cuitArray[10];

  const coeficientes = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;

  for (let i = 0; i < 10; i++) {
    suma += cuitArray[i] * coeficientes[i];
  }

  const resto = suma % 11;
  const digitoCalculado = 11 - resto;

  if (digitoCalculado === 11) {
    return digitoVerificador === 0;
  }

  if (digitoCalculado === 10) {
    // La AFIP no asigna CUIT con dígito verificador 10.
    // En algunos casos de CUIL se puede usar el dígito 9 en su lugar.
    // Para una validación estricta de CUIT, se considera inválido.
    return false;
  }

  return digitoVerificador === digitoCalculado;
};


export const validarTelefono = (telefono: string): boolean => /^\d{10}$/.test(telefono);


/**
 * Valida si una cadena de texto tiene el formato de un correo electrónico válido.
 *
 * Utiliza una expresión regular que cubre la mayoría de los casos de uso estándar,
 * pero no intenta validar todas las posibilidades teóricas del RFC 5322.
 *
 * @param email La cadena de texto a validar.
 * @returns `true` si el correo electrónico tiene un formato válido, `false` en caso contrario.
 */
export const validarEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Expresión regular para validar la mayoría de los correos electrónicos prácticos.
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  return emailRegex.test(email);
};

export const validarFormatoContrasena = (contrasena: string): boolean => {
  // debe tener al menos 4 caracteres.
  if (contrasena.length < 4) {
    return false;
  }

  return true;
}