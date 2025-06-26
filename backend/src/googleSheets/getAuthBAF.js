import { google } from 'googleapis';
import 'dotenv/config';

const authorize = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL_BAF,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY_BAF?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// ID del spreadsheet y el rango que querés leer
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEETS_ID_BAF || 'TU_SPREADSHEET_ID_AQUI'; // Cambiá por tu ID real
const range = 'principal!A1:C3'; // Cambiá "Hoja1" por el nombre real si es distinto

authorize.getClient()
  .then(async (client) => {
    console.log('✅ Autenticación correcta');

    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    console.log('📄 Datos leídos de la hoja:');
    console.table(response.data.values);
  })
  .catch((err) => {
    console.error('❌ Error al autenticar o al leer:', err);
  });

export default authorize;
