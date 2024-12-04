import { promises as fs } from 'fs';
import path from 'path';

const MOMENTS_DIR = 'data';
const MOMENTS_FILE = 'moments.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure directory exists
    await fs.mkdir(path.join(process.cwd(), MOMENTS_DIR), { recursive: true });

    // Write moments to file
    const filePath = path.join(process.cwd(), MOMENTS_DIR, MOMENTS_FILE);
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));

    res.status(200).json({ message: 'Moments saved successfully' });
  } catch (error) {
    console.error('Error saving moments:', error);
    res.status(500).json({ message: 'Failed to save moments' });
  }
}