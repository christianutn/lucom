import { IOrigenDato, IOrigenDatoCreate } from "../types";
export const getOrigenesDatos = async (): Promise<IOrigenDato[]> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/origen-datos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        const data: IOrigenDato[]  = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${'No se pudieron obtener los datos de origen de datos' } `);
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
export const putOrigeneDato = async (origenDato: IOrigenDato): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/origen-datos/${origenDato.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(origenDato)
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No fue posible actualizar el origen de dato");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const postOrigenDato = async (origenDatos: IOrigenDatoCreate): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/origen-datos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(origenDatos)
        });
        const data = await response.json();
        if (response.status !== 201) {
            throw new Error("No fue posible crear el origen de dato");
        }

        return data
    } catch (error) {
        throw error;
    }
}

