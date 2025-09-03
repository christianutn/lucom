// backend/src/cargas/cargasClientes.ts

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

// Importa tus modelos y la instancia de sequelize
import sequelize from '../config/base_datos.js';
import Cliente from '../models/cliente.models.js';
import TipoDocumento from '../models/tipo_documento.models.js';

import { IClienteCreate } from '../types/cliente.d.js';

// --- Configuración del Proceso ---
const TAMANO_LOTE = 1000; // Número de filas a insertar por cada consulta.

// Obtenemos la ruta del directorio actual de forma compatible con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUTA_ARCHIVO_CSV = path.join(__dirname, 'final.csv');

/**
 * Transforma una fecha en formato DD/MM/YYYY (o similar) a YYYY-MM-DD.
 * Devuelve null si la fecha es inválida o está vacía.
 * @param fechaString La fecha del archivo CSV.
 * @returns La fecha formateada o null.
 */

/**
 * Función principal para cargar el archivo CSV de clientes en la base de datos.
 */
async function cargarClientesDesdeCSV() {
  console.log('Iniciando el proceso de carga masiva de clientes...');

  // 1. Cargar los tipos de documento en memoria para un mapeo rápido
  let tipoDocMap: Map<string, number>;
  try {
    const tiposDocumento = await TipoDocumento.findAll({ where: { activo: 1 } });
    tipoDocMap = new Map(tiposDocumento.map(td => [td.descripcion.toUpperCase(), td.id]));
    console.log('Tipos de documento cargados en memoria:', Array.from(tipoDocMap.keys()));
  } catch (error) {
    console.error('Error fatal: No se pudieron cargar los tipos de documento de la base de datos.', error);
    return; // Detenemos la ejecución si no podemos mapear los tipos
  }

  // 2. Usar una transacción de Sequelize para garantizar la integridad de los datos
  try {
    await sequelize.transaction(async (t) => {
      let lote: IClienteCreate[] = [];
      let contadorTotal = 0;
      let contadorSaltados = 0;
      
      const stream = fs.createReadStream(RUTA_ARCHIVO_CSV, { encoding: 'utf-8' })
        .pipe(csv({ separator: ';' }));

      console.log(`Iniciando lectura del archivo: ${RUTA_ARCHIVO_CSV}`);

      for await (const fila of stream) {
        // 3. Transformar y validar cada fila del CSV
        const tipoDocString = fila.tipoDocumento?.trim().toUpperCase();
        const tipoDocumentoId = tipoDocString ? tipoDocMap.get(tipoDocString) : undefined;
        


        // Validaciones: Omitimos filas con datos esenciales faltantes
        if (!fila.documento || !fila.nombre_reconocido || !fila.apellido_reconocido || !tipoDocumentoId) {
            console.warn(`[Fila Omitida] Datos incompletos o tipo de documento no encontrado: ${JSON.stringify(fila)}`);
            contadorSaltados++;
            continue;
        }

        const nuevoCliente: IClienteCreate = {
          numero_documento: fila.documento.trim(),
          nombre: fila.nombre_reconocido.trim(),
          apellido: fila.apellido_reconocido.trim(),
          tipo_documento: tipoDocumentoId,
          // Los demás campos usarán los valores por defecto del modelo (e.g., activo: 1)
        };

        
        if (fila.fechaNacimiento) {
          nuevoCliente.fecha_nacimiento = fila.fechaNacimiento.trim();
          //console.log(fila.fechaNacimiento);
        }

        // validar correo electronico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (fila.email && emailRegex.test(fila.email)){
            nuevoCliente.correo_electronico = fila.email.trim();
            //console.log(fila.email);
        }

        // validar numero de telefono celular
        const telefonoRegex = /^\d{10}$/;
        if (fila.telefono1 && telefonoRegex.test(fila.telefono1)){
            //console.log(fila.telefono1);
            nuevoCliente.telefono_principal = fila.telefono1.trim();
        }



        lote.push(nuevoCliente);
        contadorTotal++;

        // 4. Insertar el lote cuando alcance el tamaño definido
        if (lote.length >= TAMANO_LOTE) {
          await Cliente.bulkCreate(lote, { transaction: t, ignoreDuplicates: true });
          console.log(`✅ Lote de ${lote.length} clientes insertado. Total procesado: ${contadorTotal}.`);
          lote = []; // Limpiar el lote para el siguiente ciclo
        }
      }

      // 5. Insertar el último lote restante
      if (lote.length > 0) {
        await Cliente.bulkCreate(lote, { transaction: t, ignoreDuplicates: true });
        console.log(`✅ Lote final de ${lote.length} clientes insertado.`);
      }

      console.log('\n--- Resumen del Proceso ---');
      console.log(`🎉 ¡Carga masiva completada exitosamente!`);
      console.log(`Total de filas procesadas del CSV: ${contadorTotal}`);
      console.log(`Total de filas omitidas por datos inválidos: ${contadorSaltados}`);
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
cargarClientesDesdeCSV();