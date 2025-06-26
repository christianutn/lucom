import { google } from 'googleapis';
import 'dotenv/config';

const authorize = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL_BAF,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY_BAF?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEETS_ID_BAF || 'TU_SPREADSHEET_ID_AQUI'; // Cambia por tu ID real
const sheetName = 'principal'; // cambiá según tu hoja

const nuevoDato = {
  "Responsable": "Luis",
  "Entre Calles": "Calle 1 / Calle 2",
};

// Función para agregar una fila mapeando claves a columnas
export const agregarFilaPorNombreColumnas = async(dataObject) => {
  const client = await authorize.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  // 1. Leer encabezados
  const encabezadosRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!1:1`,
  });

  const encabezados = encabezadosRes.data.values?.[0] || [];

  // 2. Armar fila en orden de columnas
  const filaOrdenada = encabezados.map(col => dataObject[col] || '');

  // 3. Agregar fila
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [filaOrdenada],
    },
  });

  console.log('✅ Fila agregada correctamente');
}

// Ejecutar prueba
//agregarFilaPorNombreColumnas(nuevoDato).catch(console.error);
