import {IConsultaBbooCreate} from "../types";


export const postConsultaBboo = async (consulta: IConsultaBbooCreate): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/consultas-bboo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(consulta)
        });
        const data = await response.json();
        if (response.status !== 201) {
            throw new Error("No fue posible crear consulta bboo");
        }

        return data
    } catch (error) {
        throw error;
    }
}