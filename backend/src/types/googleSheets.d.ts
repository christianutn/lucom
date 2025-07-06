// src/types/googleSheets.d.ts

// Usamos PascalCase (NuevaFilaBaf) por convención.
/**
 * Representa una fila que se va a insertar o leer en la hoja de Google Sheets para BAF.
 *
 * Permite acceso dinámico mediante indexación (`[key: string]`),
 * y además define las propiedades más comunes para autocompletado y validación de tipos.
 *
 * @property {string} [Marca temporal] Fecha y hora de carga del registro (generalmente generada por Google Sheets).
 * @property {string} [Vendedor] Nombre del vendedor que cargó la fila.
 * @property {string} [DNI (solo numeros, sin puntos. Si es CUIT anteponer CUIT al número)] Documento del cliente o CUIT.
 * @property {string} [Telefono1] Teléfono principal del cliente.
 * @property {string} [Telefono2 IMPORTANTE mejora contacto!] Teléfono secundario o alternativo.
 * @property {string} [email] Correo electrónico del cliente.
 * @property {string} [Abono] Nombre o tipo de abono contratado.
 * @property {string} [TVHD] Indica si el cliente tiene TV HD (generalmente "1" o "0").
 * @property {string} [Cant. DECOS] Cantidad de decodificadores contratados.
 * @property {string} [ZONA] Zona o región del cliente.
 * @property {string} [Horario Contacto / OBSERVACIONES] Comentarios u observaciones sobre el mejor horario de contacto.
 * @property {string} [Origen Dato] Indica de dónde proviene el dato (ejemplo: campaña, base externa, etc).
 * @property {string} [PORTABILIDAD - CONVERGENCIA] Información de portabilidad o convergencia (por ejemplo, “Sí” / “No”).
 * @property {string} [CELULAR PROMO CONVERGENTE] Número de celular que participa en la promoción convergente.
 * @property {string} [TIPO DOMICILIO] Tipo de domicilio (ejemplo: casa, departamento, etc).
 * @property {string} [Entre Calles] Detalle de la ubicación entre calles.
 * 
 * @property {string | number | undefined} [key] Permite acceder dinámicamente a cualquier otra columna que pueda existir.
 */
export interface NuevaFilaBaf {
    [key: string]: string | number | undefined;

    "Marca temporal"?: string;
    "Vendedor"?: string;
    "DNI (solo numeros, sin puntos. Si es CUIT anteponer CUIT al número)"?: string;
    "Telefono1"?: string;
    "Telefono2 IMPORTANTE mejora contacto!"?: string;
    "email"?: string;
    "Abono"?: string;
    "TVHD"?: string;
    "Cant. DECOS"?: string;
    "ZONA"?: string;
    "Horario Contacto / OBSERVACIONES"?: string;
    "Origen Dato"?: string;
    "PORTABILIDAD - CONVERGENCIA"?: string;
    "CELULAR PROMO CONVERGENTE"?: string;
    "TIPO DOMICILIO"?: string;
    "Entre Calles"?: string;
    "Apellido y Nombre"?: string;
    "Fecha Nacim."?: string;
    "Domicilio"?: string;
    "Entre Calles"?: string;
    "TVHD"?: string;
}

/**
 * @property {string} [Marca temporal] Fecha y hora de carga del registro (generalmente generada por Google Sheets).
 * @property {string} [Vendedor (Seleccione Vendedor)] Nombre del vendedor que cargó la fila.
 * @property {string} [Nombre y Apellido Cliente] Nombre y apellido del cliente.
 * @property {string} [DNI / LE / LC / CUIT (ingrese solo números)] Documento del cliente o CUIT.
 * @property {string} [Fecha Nacimiento Cliente] Fecha de nacimiento del cliente.
 * @property {string} [NIM a Portar (solo linea, no agregar otra info)] NIM a portar.
 * @property {string} [Correo Cliente] Correo del cliente.
 * @property {string} [Gigas acordados con el cliente] Gigas acordados con el cliente.
 * @property {string} [Compañía Actual] Compañía actual.
 * @property {string} [CONTACTO ALTERNATIVO] Contacto alternativo.
 * @property {string} [Domicilio del Cliente (ingrese calle, nro, piso, dpto, entrecalles y otros datos extras)] Domicilio del cliente.
 * @property {string} [ORIGEN DATO] Origen del dato.
 */

export interface NuevaFilaPorta {
    [key: string]: string | number | undefined;
    "Marca temporal"?: string;
    "Vendedor (Seleccione Vendedor)"?: string;
    "Nombre y Apellido Cliente"?: string;
    "DNI / LE / LC / CUIT (ingrese solo números)"?: string;
    "Fecha Nacimiento Cliente"?: string;
    "NIM a Portar (solo linea, no agregar otra info)"?: string;
    "Correo Cliente"?: string;
    "Gigas acordados con el cliente"?: string;
    "Compañía Actual"?: string;
    "CONTACTO ALTERNATIVO"?: string;
    "Domicilio del Cliente (ingrese calle, nro, piso, dpto, entrecalles y otros datos extras)"?: string;
    "ORIGEN DATO"?: string;
}   
