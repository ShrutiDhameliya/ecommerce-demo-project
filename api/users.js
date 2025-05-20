import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Helper function to read JSON file
async function readData(fileName) {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return [];
  }
}

// Helper function to write JSON file
async function writeData(fileName, data) {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    throw error;
  }
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const data = await readData('users.json');
        const users = Array.isArray(data) ? data : (data.users || []);
        res.status(200).json(users);
        break;

      case 'POST':
        const existingData = await readData('users.json');
        const existingUsers = Array.isArray(existingData) ? existingData : (existingData.users || []);
        const newUser = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString(),
        };
        existingUsers.push(newUser);
        await writeData('users.json', existingUsers);
        res.status(201).json(newUser);
        break;

      case 'PUT':
        const { id } = req.query;
        const updateData = await readData('users.json');
        const updateUsers = Array.isArray(updateData) ? updateData : (updateData.users || []);
        const index = updateUsers.findIndex(user => user.id === id);
        
        if (index === -1) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        updateUsers[index] = { ...updateUsers[index], ...req.body };
        await writeData('users.json', updateUsers);
        res.status(200).json(updateUsers[index]);
        break;

      case 'DELETE':
        const { id: deleteId } = req.query;
        const deleteData = await readData('users.json');
        const deleteUsers = Array.isArray(deleteData) ? deleteData : (deleteData.users || []);
        const deleteIndex = deleteUsers.findIndex(user => user.id === deleteId);
        
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        deleteUsers.splice(deleteIndex, 1);
        await writeData('users.json', deleteUsers);
        res.status(200).json({ message: 'User deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 