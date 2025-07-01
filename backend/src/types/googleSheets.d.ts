// src/types/googleSheets.d.ts

// Usamos PascalCase (NuevaFilaBaf) por convención.
export interface NuevaFilaBaf {
    // ESTA LÍNEA ES LA MÁS IMPORTANTE PARA QUE EL CÓDIGO FUNCIONE
    // Permite que el objeto sea indexado por cualquier string.
    [key: string]: string | number | undefined;

    // Propiedades conocidas para autocompletado y seguridad de tipos
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
}