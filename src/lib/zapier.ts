import type { Moment, MomentInput } from '../types/moments';

const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/20919244/2ic9avg/';

async function fetchWithTimeout(url: string, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { 
      ...options, 
      signal: controller.signal 
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function getMoments(): Promise<Moment[]> {
  try {
    const data = await fetchWithTimeout(ZAPIER_WEBHOOK_URL);
    
    // Transform the Zapier Tables data to our Moment type
    const moments = data.map((item: any) => ({
      id: item.id,
      text: item.text,
      timestamp: parseInt(item.timestamp),
      likes: parseInt(item.likes || '0'),
      weather: {
        temp: parseFloat(item.weather_temp),
        windSpeed: parseFloat(item.weather_wind),
        precipMm: parseFloat(item.weather_precip),
        condition: item.weather_condition
      }
    }));

    return moments.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching moments:', error);
    throw error;
  }
}

export async function addMoment({ text, weather }: MomentInput): Promise<Moment> {
  try {
    const moment: Moment = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
      likes: 0,
      weather
    };

    // Format data for Zapier Tables
    const zapierData = {
      id: moment.id,
      text: moment.text,
      timestamp: moment.timestamp.toString(),
      likes: '0',
      weather_temp: weather.temp.toString(),
      weather_wind: weather.windSpeed.toString(),
      weather_precip: weather.precipMm.toString(),
      weather_condition: weather.condition
    };

    await fetchWithTimeout(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(zapierData)
    });

    return moment;
  } catch (error) {
    console.error('Error adding moment:', error);
    throw error;
  }
}

export async function likeMoment(id: string): Promise<void> {
  try {
    // Get current moments to find the one to update
    const data = await fetchWithTimeout(ZAPIER_WEBHOOK_URL);
    const moment = data.find((item: any) => item.id === id);
    
    if (!moment) {
      throw new Error('Moment not found');
    }

    // Update likes count
    const currentLikes = parseInt(moment.likes || '0');
    const zapierData = {
      ...moment,
      likes: (currentLikes + 1).toString()
    };

    await fetchWithTimeout(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'update',
        id,
        data: zapierData
      })
    });
  } catch (error) {
    console.error('Error liking moment:', error);
    throw error;
  }
}

export async function deleteMoment(id: string): Promise<void> {
  try {
    await fetchWithTimeout(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'delete',
        id
      })
    });
  } catch (error) {
    console.error('Error deleting moment:', error);
    throw error;
  }
}