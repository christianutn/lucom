import { IAbono, IAbonoUpdate, IAbonoCreate } from "../types";
export const getAbonos = async (): Promise<IAbono[]> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/abonos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        const data: IAbono[]  = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${'No se pudieron obtener los datos de los abonos' } `);
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
export const putAbono = async (origenDato: IAbonoUpdate): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/abonos/${origenDato.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(origenDato)
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No fue posible actualizar el abono");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const postAbono = async (origenDatos: IAbonoCreate): Promise<IAbonoCreate> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/abonos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(origenDatos)
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

