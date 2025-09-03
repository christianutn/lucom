// backend/src/cargas/cargasDomicilios.ts

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

// Importa tus modelos y la instancia de sequelize
import sequelize from '../config/base_datos.js';
import Cliente from '../models/cliente.models.js';
import Domicilio from '../models/domicilio.models.js';
import { IDomicilioCreate } from '../types/domicilio.d.js';

// --- Configuración del Proceso ---
const TAMANO_LOTE = 1000; // Número de filas a insertar por cada consulta.

// Obtenemos la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUTA_ARCHIVO_CSV = path.join(__dirname, 'final.csv');

/**
 * Parsea la columna 'entreCalles' para obtener dos calles separadas.
 * @param entreCallesString La cadena completa, ej: "CALLE A Y CALLE B".
 * @returns Un objeto con entre_calle_1 y entre_calle_2.
 */
function parsearEntreCalles(entreCallesString: string | null | undefined): { entre_calle_1: string | null, entre_calle_2: string | null } {
    if (!entreCallesString) {
        return { entre_calle_1: null, entre_calle_2: null };
    }
    // Usamos una regex case-insensitive para separar por " y "
    const calles = entreCallesString.split(/ y /i);
    return {
        entre_calle_1: calles[0]?.trim() || null,
        entre_calle_2: calles[1]?.trim() || null
    };
}


/**
 * Función principal para cargar los domicilios desde el CSV y vincularlos a los clientes existentes.
 */
async function cargarDomiciliosDesdeCSV() {
    console.log('Iniciando el proceso de carga masiva de domicilios...');

    // 1. PASO CLAVE: Cargar un mapa de clientes (documento -> id) en memoria.
    // Esto es súper eficiente para evitar miles de consultas a la BD.
    let clienteMap: Map<string, number>;
    try {
        console.log('Cargando clientes existentes en memoria para el mapeo...');
        // Pedimos solo las columnas que necesitamos para optimizar memoria
        const clientes = await Cliente.findAll({
            attributes: ['id', 'numero_documento']
        });
        clienteMap = new Map(clientes.map(c => [c.numero_documento, c.id]));
        console.log(`✅ ${clienteMap.size} clientes cargados en el mapa de búsqueda.`);
    } catch (error) {
        console.error('Error fatal: No se pudieron cargar los clientes de la base de datos.', error);
        return; // Detenemos la ejecución si no podemos vincular
    }

    // 2. Usar una transacción de Sequelize para garantizar la integridad
    try {
        await sequelize.transaction(async (t) => {
            let lote: IDomicilioCreate[] = [];
            let contadorTotal = 0;
            let contadorSaltados = 0;

            const stream = fs.createReadStream(RUTA_ARCHIVO_CSV, { encoding: 'utf-8' })
                .pipe(csv({ separator: ';' }));

            console.log(`Iniciando lectura del archivo: ${RUTA_ARCHIVO_CSV}`);

            for await (const fila of stream) {
                // 3. Buscar el ID del cliente usando el mapa en memoria
                const clienteId = clienteMap.get(fila.documento?.trim());

                // Validaciones: Omitimos filas si el cliente no existe o faltan datos de domicilio
                if (!clienteId) {
                    // Este console.warn es útil para ver si hay documentos en el CSV que no están en la BD
                    // console.warn(`[Fila Omitida] Cliente con documento ${fila.documento} no encontrado.`);
                    contadorSaltados++;
                    continue;
                }
                if (!fila.calle || !fila.altura) {
                    console.warn(`[Fila Omitida] Domicilio sin calle o altura para documento ${fila.documento}.`);
                    contadorSaltados++;
                    continue;
                }

                // Parsear los campos del domicilio
                const entreCallesParseadas = parsearEntreCalles(fila.entreCalles);
                const pisoNum = parseInt(fila.piso?.trim(), 10);

                
                
                const nuevoDomicilio: IDomicilioCreate = {
                    cliente_id: clienteId,
                    nombre_calle: fila.calle.trim(),
                    numero_calle: fila.altura.trim(),
                    departamento: fila.departamento?.trim() || null,
                    // barrio_id se deja como null ya que no está en el CSV
                    // activo usará el valor por defecto del modelo (1)
                };

                if ( !isNaN(pisoNum)) nuevoDomicilio.piso = pisoNum;
                if(entreCallesParseadas.entre_calle_1) nuevoDomicilio.entre_calle_1 = entreCallesParseadas.entre_calle_1.trim();
                if(entreCallesParseadas.entre_calle_2) nuevoDomicilio.entre_calle_2 = entreCallesParseadas.entre_calle_2.trim();



                lote.push(nuevoDomicilio);
                contadorTotal++;

                // 4. Insertar el lote cuando alcance el tamaño definido
                if (lote.length >= TAMANO_LOTE) {
                    await Domicilio.bulkCreate(lote, { transaction: t, ignoreDuplicates: true });
                    console.log(`✅ Lote de ${lote.length} domicilios insertado. Total procesado: ${contadorTotal}.`);
                    lote = [];
                }
            }

            // 5. Insertar el último lote restante
            if (lote.length > 0) {
                await Domicilio.bulkCreate(lote, { transaction: t, ignoreDuplicates: true });
                console.log(`✅ Lote final de ${lote.length} domicilios insertado.`);
            }
            
            console.log('\n--- Resumen del Proceso ---');
            console.log(`🎉 ¡Carga masiva de domicilios completada exitosamente!`);
            console.log(`Total de filas procesadas del CSV: ${contadorTotal}`);
            console.log(`Total de filas omitidas (cliente no encontrado o datos faltantes): ${contadorSaltados}`);
            console.log('La transacción se ha confirmado (commit).');
        });
    } catch (error) {
        console.error('\n❌ Ocurrió un error catastrófico durante la transacción. Se revertirán todos los cambios (rollback).', error);
    } finally {
        await sequelize.close();
        console.log('Conexión a la base de datos cerrada.');
    }
}

// Ejecutar la función principal
cargarDomiciliosDesdeCSV();