/**
 * Formatea el nombre de una calle en tiempo real mientras el usuario escribe.
 * Aplica capitalización de tipo título, limpia espacios innecesarios y maneja
 * preposiciones y artículos de forma inteligente.
 *
 * @param nombreCalle El valor actual del campo de texto de la calle.
 * @returns El nombre de la calle formateado, permitiendo un espacio al final para continuar escribiendo.
 */
export const formatearNombreCalle = (nombreCalle: string): string => {
  if (typeof nombreCalle !== 'string') return '';

  // 1. Limpiar espacios: elimina los del inicio y colapsa los múltiples en el medio.
  let calle = nombreCalle.replace(/^\s+/, '').replace(/\s\s+/g, ' ');

  // 2. Palabras a mantener en minúsculas (a menos que sea la primera palabra).
  const palabrasMinusculas = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'en', 'a']);

  const palabras = calle.split(' ');

  const palabrasFormateadas = palabras.map((palabra, index) => {
    // Si la palabra está vacía (resultado de un espacio al final), se mantiene.
    if (palabra === '') return '';

    // Si es una preposición/artículo y no es la primera palabra, se pone en minúscula.
    if (index > 0 && palabrasMinusculas.has(palabra.toLowerCase())) {
      return palabra.toLowerCase();
    }

    // 3. Capitaliza la primera letra de cada parte (maneja guiones y apóstrofes).
    // Convierte el resto a minúsculas para corregir entradas como "AVENIDA".
    return palabra.split('-').map(part =>
      part.split('\'').map(subPart =>
        subPart.charAt(0).toUpperCase() + subPart.slice(1).toLowerCase()
      ).join('\'')
    ).join('-');
  });

  return palabrasFormateadas.join(' ');
};
export const formatName = (name: string): string => {
    if (!name) return '';

    // 1. No permitir espacios al principio.
    let formattedName = name.replace(/^\s+/, '');

    // 2. Reemplazar múltiples espacios seguidos por uno solo.
    formattedName = formattedName.replace(/\s\s+/g, ' ');

    // 3. Capitalizar cada palabra y permitir un espacio al final para seguir escribiendo.
    return formattedName
        .split(' ')
        .map(word => {
            if (word === '') return ''; // Mantiene el espacio final si existe.
            // Mantiene la lógica para nombres con guiones o apóstrofes.
            return word.split('-').map(part =>
                part.split('\'').map(subPart =>
                    subPart.charAt(0).toUpperCase() + subPart.slice(1).toLowerCase()
                ).join('\'')
            ).join('-');
        })
        .join(' ');
};