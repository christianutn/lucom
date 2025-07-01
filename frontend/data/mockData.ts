
import { TipoNegocio, OrigenDato, Cliente, ServicioConvergente, TipoDomicilio, Abono, TipoConvergencia, Giga, Compania, TipoDocumento, Barrio } from '../types.js';

export const tiposNegocio: TipoNegocio[] = [
    { id: 1, descripcion: "Internet (BAF)", activo: 1 },
    { id: 3, descripcion: "Portabilidad", activo: 1 },
    { id: 4, descripcion: "Consulta BBOO", activo: 1 }
];

export const origenesDato: OrigenDato[] = [
    { id: 1, descripcion: "Redes Sociales", activo: 1 },
    { id: 2, descripcion: "Terreno", activo: 1 },
    { id: 3, descripcion: "Base Datos Claro", activo: 1 },
    { id: 4, descripcion: "Recarga Autorizada BBOO", activo: 1 },
    { id: 5, descripcion: "Mis Referidos Claro", activo: 1 },
    { id: 6, descripcion: "Llamada IN", activo: 1 }
];

// Updated to use number for ID as per new client data
export const tiposDocumento: TipoDocumento[] = [
    { id: 1, descripcion: "DNI", activo: 1 },
    { id: 2, descripcion: "CUIT", activo: 1 },
    { id: 3, descripcion: "Pasaporte", activo: 1 },
    { id: 4, descripcion: "LC", activo: 1 },
    { id: 5, descripcion: "LE", activo: 1 },
];

// Updated mockBarrios to use 'nombre' and match Barrio type
export const mockBarrios: Barrio[] = [
    { id: 1, nombre: "barrio de test2", codigo_postal: "1258s2", activo: 1 },
    { id: 2, nombre: "Centro", codigo_postal: "5000", activo: 1 },
    { id: 3, nombre: "Norte", codigo_postal: "5001", activo: 1 },
    { id: 4, nombre: "Sur", codigo_postal: "5002", activo: 1 },
];


export const clientes: Cliente[] = [
    {
        id: 1,
        tipo_documento: 1, // DNI
        numero_documento: "12345678",
        nombre: "cliente test",
        apellido: "apellido de test",
        fecha_nacimiento: "1993-11-11",
        telefono_secundario: "3512347896",
        activo: 1,
        correo_electronico: "cliente.test@example.com",
        tipoDocumento: { id: 1, descripcion: "DNI", activo: 1 }, // Keep for easy display
        domicilios: [
            {
                id: 31,
                cliente_id: 1,
                nombre_calle: "Calle test",
                numero_calle: "2020",
                entre_calle_1: "Entre calle test 1",
                entre_calle_2: "Entre calle test 2",
                barrio_id: 1,
                activo: 1,
                barrio: { id: 1, nombre: "barrio de test2", codigo_postal: "1258s2", activo: 1 }
            },
            {
                id: 30, // Another active address for client 1
                cliente_id: 1,
                nombre_calle: "Avenida Principal",
                numero_calle: "100",
                entre_calle_1: "Esquina Secundaria",
                entre_calle_2: "Otra Calle",
                barrio_id: 2, // Different barrio
                activo: 1,
                barrio: { id: 2, nombre: "Centro", codigo_postal: "5000", activo: 1 }
            }
        ],
        telefonosPrincipales: [
            { id: 4, cliente_id: 1, numero_telefono: "3518963254", fecha_modificacion: "2025-06-16T02:55:45.000Z", activo: 1 },
            { id: 3, cliente_id: 1, numero_telefono: "3519874632", fecha_modificacion: "2025-06-16T02:48:39.000Z", activo: 1 }
        ]
    },
    {
        id: 2,
        tipo_documento: 1,
        numero_documento: "28777888",
        nombre: "Christian",
        apellido: "Bergero",
        fecha_nacimiento: "1993-11-11",
        telefono_secundario: "3516341265",
        activo: 1,
        correo_electronico: null,
        tipoDocumento: { id: 1, descripcion: "DNI", activo: 1 },
        domicilios: [],
        telefonosPrincipales: [
            { id: 2, cliente_id: 2, numero_telefono: "3516326986", fecha_modificacion: "2025-06-15T00:00:00.000Z", activo: 1 }
        ]
    },
    {
        id: 3,
        tipo_documento: 1,
        numero_documento: "30123456",
        nombre: "Carlos",
        apellido: "Perez",
        fecha_nacimiento: "1980-05-15",
        telefono_secundario: "3512345679",
        activo: 1,
        correo_electronico: "carlos.perez@example.com",
        tipoDocumento: { id: 1, descripcion: "DNI", activo: 1 },
        domicilios: [
            { // Add an inactive address to test filtering
                id: 50,
                cliente_id: 3,
                nombre_calle: "Calle Inactiva",
                numero_calle: "000",
                barrio_id: 3,
                activo: 0,
                barrio: { id: 3, nombre: "Norte", activo: 1 } // Barrio itself is active
            }
        ],
        telefonosPrincipales: []
    },
    // Add a few more from the provided list for variety
    {
        id: 4,
        tipo_documento: 1,
        numero_documento: "328513371", // Corrected typo from "328513371" to string
        nombre: "Cliente de prueba",
        apellido: "Prueba",
        fecha_nacimiento: null,
        telefono_secundario: "3512365487",
        activo: 1,
        correo_electronico: null,
        tipoDocumento: { id: 1, descripcion: "DNI", activo: 1 },
        domicilios: [],
        telefonosPrincipales: []
    },
    {
        id: 193, // Example with different tipo_documento if available
        tipo_documento: 2, // CUIT example (assuming ID 2 is CUIT in tiposDocumento)
        numero_documento: "20366513575", // Example CUIT
        nombre: "Empresa Test",
        apellido: "S.A.", // Or empty if not applicable
        fecha_nacimiento: null,
        telefono_secundario: "3512365487",
        activo: 1,
        correo_electronico: "empresa@example.com",
        tipoDocumento: { id: 2, descripcion: "CUIT", activo: 1 },
        domicilios: [],
        telefonosPrincipales: [{id: 10, cliente_id:193, numero_telefono:"03514000000", fecha_modificacion: "2024-01-01T00:00:00.000Z", activo: 1}]
    }
];

export const serviciosConvergentes: ServicioConvergente[] = [
    { id: 5, descripcion: "Móvil Post Pago", activo: 1 },
    { id: 6, descripcion: "Fija", activo: 1 }
];

export const tiposDomicilio: TipoDomicilio[] = [
    { id: 1, descripcion: "Casa H", activo: 1 },
    { id: 2, descripcion: "Edificio", activo: 1 },
    { id: 3, descripcion: "Complejo", activo: 1 }
];

export const abonos: Abono[] = [
    { id: 1, descripcion: "Plan Básico 100MB", activo: 1, precio: 3000 },
    { id: 2, descripcion: "Plan Medio 300MB", activo: 1, precio: 4500 },
    { id: 3, descripcion: "Plan Premium 1GB", activo: 1, precio: 6000 },
    { id: 4, descripcion: "Plan Descontinuado", activo: 0, precio: 2000 },
];

export const tiposConvergencia: TipoConvergencia[] = [
    { id: 1, descripcion: "Convergencia Full", activo: 1 },
    { id: 2, descripcion: "Convergencia Light", activo: 1 },
    { id: 3, descripcion: "Sin Convergencia", activo: 0 },
];

export const gigas: Giga[] = [
    { id: 1, descripcion: "5 Gigas", activo: 1 },
    { id: 2, descripcion: "7 Gigas", activo: 1 },
    { id: 3, descripcion: "6 Gigas", activo: 1 }
];

export const companias: Compania[] = [
    { id: 1, descripcion: "Movistar", activo: 1 },
    { id: 2, descripcion: "Personal", activo: 1 },
    { id: 3, descripcion: "Tuenti", activo: 1 },
    { id: 4, descripcion: "Otra", activo: 0 },
];
