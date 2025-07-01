import { google, Auth, sheets_v4 } from 'googleapis';
import 'dotenv/config';
import AppError from '../utils/appError.js'; // Asumimos que tienes tu clase de error personalizada

// --- Verificación de Variables de Entorno y Configuración de Auth ---
// Se hace una sola vez cuando el módulo se carga.
const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL_BAF;
const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY_BAF;

if (!clientEmail || !privateKey) {
  throw new AppError('Faltan variables de entorno críticas para la autenticación con Google Sheets (BAF)', 500);
}

const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
  credentials: {
    client_email: clientEmail,
    // La comprobación de `privateKey` arriba asegura que no es undefined aquí.
    private_key: privateKey.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // Usamos .readonly si solo vamos a leer.
});

/**
 * Lee un rango de celdas de una hoja de cálculo de Google.
 * @param spreadsheetId El ID de la hoja de cálculo de Google.
 * @param range El rango a leer en formato A1 (ej: 'principal!A1:C10').
 * @returns Un array de arrays con los valores de las celdas, o un array vacío si no hay datos.
 */
export const leerRangoDeHoja = async (
  spreadsheetId: string,
  range: string
): Promise<(string | number)[][]> => {
  try {
    // Obtenemos la instancia de la API de Sheets, pasando el objeto `auth` directamente.
    // La librería maneja la obtención del cliente internamente.
    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

    console.log(`🚀 Leyendo datos de: ${spreadsheetId}, rango: ${range}`);

    // Realizamos la llamada a la API con await para un código más limpio.
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const data = response.data.values;

    // Verificamos si la respuesta contiene datos.
    if (!data || data.length === 0) {
      console.log('✅ No se encontraron datos en el rango especificado.');
      return []; // Devolvemos un array vacío para consistencia.
    }

    console.log('✅ Datos leídos correctamente.');
    // El tipo de `data` es `any[][] | null | undefined`, hacemos un cast si estamos seguros del formato.
    return data as (string | number)[][];

  } catch (error) {
    console.error('❌ Error al autenticar o leer la hoja de cálculo:', error);
    // Envolvemos el error en nuestra clase AppError para un manejo centralizado.
    throw new AppError('No se pudo leer la hoja de cálculo. Revisa los permisos y el ID.', 500);
  }
};

// --- Ejemplo de cómo usar esta función ---

async function ejecutarPrueba() {
  const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEETS_ID_BAF;
  if (!sheetId) {
    console.error("Falta la variable de entorno GOOGLE_SHEETS_SPREADSHEETS_ID_BAF para la prueba.");
    return;
  }

  const rangoDePrueba = 'principal!A1:C3';

  try {
    const datosLeidos = await leerRangoDeHoja(sheetId, rangoDePrueba);
    console.log('📄 Resultado de la lectura:');
    console.table(datosLeidos);
  } catch (error) {
    // El error ya fue logueado dentro de la función, aquí podrías manejarlo de otra forma si quisieras.
    console.error("La prueba de lectura falló.");
  }
}

// Para ejecutar la prueba, puedes descomentar la siguiente línea:
// ejecutarPrueba();