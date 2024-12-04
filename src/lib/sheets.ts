import axios from 'axios';
import type { Moment, MomentInput } from '../types/moments';

const SHEET_ID = '1RvpNxwpvqR2qY8z3X4m5n6L7K8J9P0Q1';
const API_KEY = 'AIzaSyC1X2Y3Z4W5V6U7T8S9R0Q1P2O3I4U5Y6T';
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;

export async function getMoments(): Promise<Moment[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/values/Moments!A2:H?key=${API_KEY}`
    );

    if (!response.data.values) return [];

    return response.data.values.map((row: any[]) => ({
      id: row[0],
      text: row[1],
      timestamp: parseInt(row[2]),
      likes: parseInt(row[3]),
      weather: {
        temp: parseFloat(row[4]),
        windSpeed: parseFloat(row[5]),
        precipMm: parseFloat(row[6]),
        condition: row[7]
      }
    })).sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching moments:', error);
    throw error;
  }
}

export async function addMoment({ text, weather }: MomentInput): Promise<Moment> {
  try {
    const moment = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
      likes: 0,
      weather
    };

    const row = [
      moment.id,
      moment.text,
      moment.timestamp.toString(),
      '0',
      weather.temp.toString(),
      weather.windSpeed.toString(),
      weather.precipMm.toString(),
      weather.condition
    ];

    await axios.post(
      `${BASE_URL}/values/Moments!A:H:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        values: [row]
      }
    );

    return moment;
  } catch (error) {
    console.error('Error adding moment:', error);
    throw error;
  }
}

export async function likeMoment(id: string): Promise<void> {
  try {
    const moments = await getMoments();
    const momentIndex = moments.findIndex(m => m.id === id);
    if (momentIndex === -1) throw new Error('Moment not found');

    const moment = moments[momentIndex];
    const rowNumber = momentIndex + 2;

    await axios.put(
      `${BASE_URL}/values/Moments!D${rowNumber}?valueInputOption=RAW&key=${API_KEY}`,
      {
        values: [[moment.likes + 1]]
      }
    );
  } catch (error) {
    console.error('Error liking moment:', error);
    throw error;
  }
}

export async function deleteMoment(id: string): Promise<void> {
  try {
    const moments = await getMoments();
    const momentIndex = moments.findIndex(m => m.id === id);
    if (momentIndex === -1) throw new Error('Moment not found');

    const rowNumber = momentIndex + 2;
    
    await axios.post(
      `${BASE_URL}/values/Moments!A${rowNumber}:H${rowNumber}:clear?key=${API_KEY}`
    );
  } catch (error) {
    console.error('Error deleting moment:', error);
    throw error;
  }
}