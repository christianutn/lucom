const formatName = (name: string): string => {
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

export default formatName;