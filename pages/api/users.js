import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDirectory, 'users.json');

// Helper function to hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

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
        // Remove password hashes from response
        const sanitizedUsers = users.map(({ password, ...user }) => user);
        res.status(200).json(sanitizedUsers);
        break;

      case 'POST':
        const { email, password, ...userData } = req.body;

        // Validate required fields
        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user already exists
        const currentUsers = await readData(usersFile);
        if (currentUsers.some(user => user.email === email)) {
          return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password and create new user
        const hashedPassword = hashPassword(password);
        const newUser = {
          id: Date.now().toString(),
          email,
          password: hashedPassword,
          ...userData,
          createdAt: new Date().toISOString(),
          blocked: false,
        };

        console.log('Creating new user:', { ...newUser, password: '[REDACTED]' }); // Debug log

        await writeData(usersFile, [...currentUsers, newUser]);
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
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
            blocked: !allUsers[userIndex].blocked,
            updatedAt: new Date().toISOString(),
          };
          
          allUsers[userIndex] = updatedUser;
          await writeData(usersFile, allUsers);
          
          // Return user without password
          const { password: __, ...userWithoutPassword } = updatedUser;
          res.status(200).json(userWithoutPassword);
        } else {
          const { id, password: newPassword, ...updateData } = req.body;
          const allUsers = await readData(usersFile);
          const userIndex = allUsers.findIndex(user => user.id === id);
          
          if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
          }

          const updatedUser = {
            ...allUsers[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString(),
          };

          // If password is being updated, hash it
          if (newPassword) {
            updatedUser.password = hashPassword(newPassword);
          }
          
          allUsers[userIndex] = updatedUser;
          await writeData(usersFile, allUsers);
          
          // Return user without password
          const { password: ___, ...userWithoutPassword } = updatedUser;
          res.status(200).json(userWithoutPassword);
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