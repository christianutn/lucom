interface User {
    empleado_id: number | null,
    contrasena: string
}


export const login = async (user: User) : Promise<string> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            if (response.status === 401) {
                throw new Error('Usuario o contraseña incorrectos');
            } else {
                throw new Error('Se superó el limite de intentos, podrás reintentar al cabo de un minuto.');
            }
        }
    } catch (error) {
        throw error;
    }
}

