import { IGiga, IGigaUpdate, IGigaCreate } from "../types";
export const getGigas = async (): Promise<IGiga[]> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/gigas`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        const data: IGiga[]  = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${'No se pudieron obtener los datos de los gigas' } `);
        }

        if (!Array.isArray(data)) {
            throw new Error("La respuesta del servidor no es un arreglo");
        }

        return data;
    } catch (error) {
        console.error("Error en getGigas:", error);
        throw error;
    }
};
export const putGiga = async (giga: IGigaUpdate): Promise<IGiga> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/gigas/${giga.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(giga)
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No fue posible actualizar el giga");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const postGiga = async (giga: IGigaCreate): Promise<IGigaCreate> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/gigas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(giga)
        });
        const data = await response.json();
        if (response.status !== 201) {
            throw new Error("No fue posible crear el giga");
        }

        return data
    } catch (error) {
        throw error;
    }
}

