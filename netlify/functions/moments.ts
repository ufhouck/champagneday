import { Handler } from '@netlify/functions';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { moments } = JSON.parse(event.body || '{}');
    const dataDir = join(process.cwd(), 'public/data');
    
    // Ensure directory exists
    mkdirSync(dataDir, { recursive: true });
    
    // Write to the data file
    writeFileSync(
      join(dataDir, 'moments.json'),
      JSON.stringify({ moments }, null, 2)
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' })
    };
  } catch (error) {
    console.error('Error handling moments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

export { handler };