import { IUsuarioUpdate, IUsuarioCreate  } from "../types";

export const getUsuarios= async (): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/usuarios`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No se encontraron los usuarios");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const putUsuarios= async (usuario: IUsuarioUpdate): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/usuarios/${usuario.empleado_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(usuario)
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No fue posible actualizar el usuario");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const postUsuario= async (usuario: IUsuarioCreate): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(usuario)
        });
        const data = await response.json();
        if (response.status !== 201) {
            throw new Error("No fue posible crear el usuario");
        }

        return data
    } catch (error) {
        throw error;
    }
}



export const getMiUsuario= async (): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/usuarios/mi-usuario`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No se encontraron los datos de mi usuario");
        }

        return data
    } catch (error) {
        throw error;
    }
}