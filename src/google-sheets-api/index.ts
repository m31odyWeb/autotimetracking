import 'dotenv/config';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

const sheetId = process.env.GOOGLE_SHEET_ID as string;

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

const initSheetsAPI = async () => {
  const auth = new GoogleAuth({
    scopes,
    keyFilename: 'keys.json',
  });
  return google.sheets({ version: 'v4', auth });
};

const insertData = async (range: string, values: Array<string>[]) => {
  const api = await initSheetsAPI();

  const request = {
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values,
    },
  };

  const { data, status } = await api.spreadsheets.values.append(request);

  return { data, status };
};

const readData = async () => {
  const api = await initSheetsAPI();
  const request = {
    spreadsheetId: sheetId,
  };
  const { data } = await api.spreadsheets.values.get(request);

  return data;
};

export const googleSheetsApi = {
  insertData,
  readData,
};
