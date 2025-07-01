// src/services/googleSheetsService.ts

import { google, Auth, sheets_v4 } from 'googleapis';
import 'dotenv/config';
import AppError from '../utils/appError.js';
import { NuevaFilaBaf } from "../types/googleSheets.js";

// ... (El código de las variables de entorno no cambia)
const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL_BAF;
const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY_BAF;
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEETS_ID_BAF;

if (!clientEmail || !privateKey || !spreadsheetId) {
  throw new AppError('Faltan variables de entorno críticas para Google Sheets (BAF)', 500);
}

// El objeto `auth` es lo único que necesitamos para la autenticación.
const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheetName = 'principal';

/**
 * Agrega una nueva fila a Google Sheets mapeando un objeto de datos a las columnas.
 * @param dataObject Objeto con claves que coinciden con los encabezados de la hoja.
 */
export const agregarFilaPorNombreColumnas = async (dataObject: NuevaFilaBaf): Promise<void> => {
  try {
    // --- CAMBIO CLAVE ---
    // 1. Hemos ELIMINADO la línea: `const client = await auth.getClient();`
    // 2. Pasamos el objeto `auth` principal directamente a la configuración de sheets.
    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth: auth });

    const encabezadosRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!1:1`,
    });

    const encabezados = encabezadosRes.data.values?.[0];

    if (!encabezados || encabezados.length === 0) {
      throw new AppError('No se encontraron encabezados en la hoja de cálculo.', 500);
    }

    const filaOrdenada: (string | number)[] = encabezados.map(
      (colName: string) => dataObject[colName] || ''
    );

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [filaOrdenada],
      },
    });

    console.log('✅ Fila agregada correctamente a Google Sheets.');

  } catch (error) {
    console.error('❌ Error al agregar fila en Google Sheets:', error);
    throw new AppError('Error de comunicación con Google Sheets.', 500);
  }
};

