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

// Helper function to write data
async function writeData(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const users = await readData(usersFile);
        res.status(200).json(users);
        break;

      case 'POST':
        const newUser = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString(),
          isBlocked: false,
        };
        const currentUsers = await readData(usersFile);
        await writeData(usersFile, [...currentUsers, newUser]);
        res.status(201).json(newUser);
        break;

      case 'PUT':
        if (req.query.action === 'toggle-block') {
          const { id } = req.query;
          const allUsers = await readData(usersFile);
          const userIndex = allUsers.findIndex(user => user.id === id);
          
          if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
          }

          const updatedUser = {
            ...allUsers[userIndex],
            isBlocked: !allUsers[userIndex].isBlocked,
            updatedAt: new Date().toISOString(),
          };
          
          allUsers[userIndex] = updatedUser;
          await writeData(usersFile, allUsers);
          res.status(200).json(updatedUser);
        } else {
          const { id } = req.body;
          const allUsers = await readData(usersFile);
          const userIndex = allUsers.findIndex(user => user.id === id);
          
          if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
          }

          const updatedUser = {
            ...allUsers[userIndex],
            ...req.body,
            updatedAt: new Date().toISOString(),
          };
          
          allUsers[userIndex] = updatedUser;
          await writeData(usersFile, allUsers);
          res.status(200).json(updatedUser);
        }
        break;

      case 'DELETE':
        const { id: userId } = req.query;
        const existingUsers = await readData(usersFile);
        const filteredUsers = existingUsers.filter(user => user.id !== userId);
        
        if (filteredUsers.length === existingUsers.length) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        await writeData(usersFile, filteredUsers);
        res.status(200).json({ message: 'User deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 