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
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.userId) {
          const orders = await readData('orders.json');
          const userOrders = orders.filter(order => order.userId === query.userId);
          res.status(200).json(userOrders);
        } else {
          const orders = await readData('orders.json');
          res.status(200).json(orders);
        }
        break;

      case 'POST':
        const orders = await readData('orders.json');
        const newOrder = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString(),
        };
        orders.push(newOrder);
        await writeData('orders.json', orders);
        res.status(201).json(newOrder);
        break;

      case 'PUT':
        const { id } = query;
        const updateOrders = await readData('orders.json');
        const index = updateOrders.findIndex(order => order.id === id);
        
        if (index === -1) {
          return res.status(404).json({ error: 'Order not found' });
        }
        
        updateOrders[index] = { ...updateOrders[index], ...req.body };
        await writeData('orders.json', updateOrders);
        res.status(200).json(updateOrders[index]);
        break;

      case 'DELETE':
        const { id: deleteId } = query;
        const deleteOrders = await readData('orders.json');
        const deleteIndex = deleteOrders.findIndex(order => order.id === deleteId);
        
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Order not found' });
        }
        
        deleteOrders.splice(deleteIndex, 1);
        await writeData('orders.json', deleteOrders);
        res.status(200).json({ message: 'Order deleted successfully' });
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