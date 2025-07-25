import { ITipoDomicilio, ITipoDomicilioCreate, ITipoDomicilioUpdate } from "../types";
export const getTiposDomicilios = async (): Promise<ITipoDomicilio[]> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/tipos-domicilios`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        const data: ITipoDomicilio[]  = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${'No se pudieron obtener los datos de los tipos de domicilios' } `);
        }

        if (!Array.isArray(data)) {
            throw new Error("La respuesta del servidor no es un arreglo");
        }

        return data;
    } catch (error) {
        console.error("Error en getOrigenesDatos:", error);
        throw error;
    }
};
export const putTipoDomicilio = async (tipoDomicilio: ITipoDomicilioUpdate): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/tipos-domicilios/${tipoDomicilio.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(tipoDomicilio)
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No fue posible actualizar el tipo de domicilio");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const postTipoDomicilio = async (abono: ITipoDomicilioCreate): Promise<ITipoDomicilioCreate> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/tipos-domicilios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(abono)
        });
        const data = await response.json();
        if (response.status !== 201) {
            throw new Error("No fue posible crear el abono");
        }

        return data
    } catch (error) {
        throw error;
    }
}

