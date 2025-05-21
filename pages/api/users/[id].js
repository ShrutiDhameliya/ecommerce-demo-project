import fs from 'fs';
import { getServerSession } from 'next-auth/next';
import path from 'path';
import { authOptions } from '../auth/[...nextauth]';

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

// Helper function to read users
const readUsers = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write users
const writeUsers = (users) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only admin can manage users
  if (session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const { name, email, role, isBlocked } = req.body;
        const users = readUsers();
        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Update user
        users[userIndex] = {
          ...users[userIndex],
          name: name || users[userIndex].name,
          email: email || users[userIndex].email,
          role: role || users[userIndex].role,
          isBlocked: isBlocked !== undefined ? isBlocked : users[userIndex].isBlocked,
          updatedAt: new Date().toISOString()
        };

        writeUsers(users);
        res.status(200).json(users[userIndex]);
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
      }
      break;

    case 'DELETE':
      try {
        const users = readUsers();
        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deleting the last admin
        const adminCount = users.filter(user => user.role === 'admin').length;
        if (users[userIndex].role === 'admin' && adminCount <= 1) {
          return res.status(400).json({ error: 'Cannot delete the last admin user' });
        }

        users.splice(userIndex, 1);
        writeUsers(users);
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 