
import {
    tiposNegocio, origenesDato, clientes, serviciosConvergentes,
    tiposDomicilio, abonos, tiposConvergencia, gigas, companias,
    tiposDocumento, mockBarrios
} from '../data/mockData';
import { SelectOption, Cliente, ClientSearchFilters, Barrio, TipoDocumento } from '../types';

const SIMULATED_DELAY = 500; // ms

// Generic filterActive for SelectOption based types
const filterActiveGeneric = <T extends { activo: number },>(data: T[]): T[] => {
    return data.filter(item => item.activo === 1);
};




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

export const getOrigenesDatos = async (): Promise<any> => {
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


export const getClientes = async (searchFilters: ClientSearchFilters): Promise<any> => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error('API URL no definida en el archivo .env');
        }

        // 🔧 Crear los parámetros de búsqueda dinámicamente
        const params = new URLSearchParams();
        Object.entries(searchFilters).forEach(([key, value]) => {
            if (value) params.append(key, value);
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
            throw new Error(data.message || "No se encontraron clientes");
        }

        return data;
    } catch (error) {
        throw error;
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

export const getTiposDomicilios = async (): Promise<any> => {
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
export const getAbonos = (): Promise<SelectOption[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(filterActiveGeneric(abonos)), SIMULATED_DELAY);
    });
};

export const getTiposConvergencias = (): Promise<SelectOption[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(filterActiveGeneric(tiposConvergencia)), SIMULATED_DELAY);
    });
};

export const getGigas = (): Promise<SelectOption[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(filterActiveGeneric(gigas)), SIMULATED_DELAY);
    });
};

export const getCompanias = (): Promise<SelectOption[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(filterActiveGeneric(companias)), SIMULATED_DELAY);
    });
};

// Returns Barrio[] which now has 'nombre'
export const getBarrios = (): Promise<Barrio[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(filterActiveGeneric(mockBarrios)), SIMULATED_DELAY);
    });
};

export const saveSale = (formData: any): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
        console.log("Simulating sale save with data:", formData);
        setTimeout(() => {
            resolve({ success: true, message: "Venta guardada exitosamente" });
        }, SIMULATED_DELAY * 2);
    });
};
