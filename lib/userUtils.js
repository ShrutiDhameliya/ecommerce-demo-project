import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Helper function to read users
export async function getUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Helper function to write users
export async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
}

// Hash password
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Create new user
export async function createUser(userData) {
  const users = await getUsers();
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    password: hashPassword(userData.password),
    isActive: true,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

// Update user
export async function updateUser(id, userData) {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  
  users[index] = {
    ...users[index],
    ...userData,
    password: userData.password ? hashPassword(userData.password) : users[index].password
  };
  
  await writeUsers(users);
  return users[index];
}

// Delete user
export async function deleteUser(id) {
  const users = await getUsers();
  const filteredUsers = users.filter(u => u.id !== id);
  if (filteredUsers.length === users.length) return false;
  
  await writeUsers(filteredUsers);
  return true;
}

// Find user by email
export async function findUserByEmail(email) {
  const users = await getUsers();
  return users.find(u => u.email === email);
}

// Find user by ID
export async function findUserById(id) {
  const users = await getUsers();
  return users.find(u => u.id === id);
} 