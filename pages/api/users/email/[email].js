import { promises as fs } from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDirectory, 'users.json');

// Helper function to read data
async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
}

export default async function handler(req, res) {
  const { email } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    console.log('Fetching user by email:', email); // Debug log

    const users = await readData(usersFile);
    const user = users.find(u => u.email === email);

    if (!user) {
      console.log('No user found with email:', email); // Debug log
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', { ...user, password: '[REDACTED]' }); // Debug log
    res.status(200).json(user);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 