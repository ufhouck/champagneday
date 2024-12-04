import { promises as fs } from 'fs';
import path from 'path';
import type { Moment, MomentInput } from '../types/moments';

const MOMENTS_DIR = path.join(process.cwd(), 'data', 'moments');

// Ensure moments directory exists
async function ensureDirectory() {
  try {
    await fs.mkdir(MOMENTS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating moments directory:', error);
  }
}

export async function getMoments(): Promise<Moment[]> {
  try {
    await ensureDirectory();
    const files = await fs.readdir(MOMENTS_DIR);
    const moments: Moment[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(MOMENTS_DIR, file), 'utf-8');
        moments.push(JSON.parse(content));
      }
    }

    return moments.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading moments:', error);
    throw error;
  }
}

export async function addMoment({ text, weather }: MomentInput): Promise<Moment> {
  try {
    await ensureDirectory();
    const moment: Moment = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
      likes: 0,
      weather
    };

    const filePath = path.join(MOMENTS_DIR, `${moment.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(moment, null, 2));
    return moment;
  } catch (error) {
    console.error('Error adding moment:', error);
    throw error;
  }
}

export async function likeMoment(id: string): Promise<void> {
  try {
    const filePath = path.join(MOMENTS_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const moment: Moment = JSON.parse(content);
    
    moment.likes += 1;
    await fs.writeFile(filePath, JSON.stringify(moment, null, 2));
  } catch (error) {
    console.error('Error liking moment:', error);
    throw error;
  }
}

export async function deleteMoment(id: string): Promise<void> {
  try {
    const filePath = path.join(MOMENTS_DIR, `${id}.json`);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting moment:', error);
    throw error;
  }
}