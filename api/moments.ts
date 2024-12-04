import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const dataDir = join(process.cwd(), 'data');
    await mkdir(dataDir, { recursive: true });

    const filePath = join(dataDir, 'moments.json');
    await writeFile(filePath, JSON.stringify(req.body, null, 2));

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Error handling moments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}