
import {  Cliente, ClientSearchFilters, ITipoDomicilio, IOrigenDato, PagedResponse} from '../types.js';


export const getTiposNegocios = async (): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/tipos-negocios`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No se encontraron las áreas");
        }

        return data
    } catch (error) {
        throw error;
    }
}

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
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No se encontraron el origen de datos");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const getTiposDocumento = async (): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/tipos-documentos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No se encontraron el origen de datos");
        }

        return data
    } catch (error) {
        throw error;
    }
}


export const getClientes = async (searchFilters: ClientSearchFilters, page: number = 1, limit: number = 10): Promise<PagedResponse<Cliente>> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        // --- CAMBIO: AÑADIR PARÁMETROS DE PAGINACIÓN ---
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        
        // Añadir filtros solo si tienen valor
        Object.entries(searchFilters).forEach(([key, value]) => {
            if (value) params.append(key, value as string);
        });

        const response = await fetch(`${apiUrl}/api/clientes?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Asume que el error del backend puede estar en data.message
            throw new Error(data.message || "Error al buscar clientes");
        }

        // --- CAMBIO: DEVUELVE EL OBJETO COMPLETO, NO SOLO LOS DATOS ---
        return data as PagedResponse<Cliente>;
    } catch (error) {
        console.error("Error en getClientes API:", error);
        throw error; // Re-lanza el error para que el componente lo maneje
    }
}

export const getServiciosConvergentes = async (): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/datos-servicios-convergencias`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No se encontraron datos servicios de convergencias");
        }

        return data
    } catch (error) {
        throw error;
    }
}

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
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("No se encontraron tipos de domicilio");
        }

        return data
    } catch (error) {
        throw error;
    }
}
export const getAbonos = async (): Promise<any> => {
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
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("Error al cargar abonos");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const getTiposConvergencias = async (): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/tipos-convergencias`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("Error al cargar tipos de convergencias");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const getGigas = async (): Promise<any> => {
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
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("Error al cargar gigas");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const getCompanias = async (): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/companias`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("Error al cargar companías");
        }

        return data
    } catch (error) {
        throw error;
    }
}
// Returns Barrio[] which now has 'nombre'
export const getBarrios = async (): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/barrios`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error("Error al cargar abonos");
        }

        return data
    } catch (error) {
        throw error;
    }
}

export const saveSale = (formData: any) => {
    console.log(formData);
};


export const postVenta = async (ventaConDetalle: any): Promise<any> => {

    try {
        console.log(ventaConDetalle);

        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        const response = await fetch(`${apiUrl}/api/ventas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(ventaConDetalle)
        });
        const data = await response.json();
        if (response.status !== 201) {
            throw new Error("Error al cargar abonos");
        }

        return data


    } catch (error) {
        console.log(error);
        throw error;
    }

}