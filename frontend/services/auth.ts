interface User {
    empleado_id: number | string | null,
    contrasena: string
}


export const login = async (user: User) : Promise<{ token: string }> => {
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
        
        if (!response.ok) {
            throw new Error(data.message || 'No se pudo iniciar sesión');
        }
        return data;
        
    } catch (error) {
        throw error;
    }
}

