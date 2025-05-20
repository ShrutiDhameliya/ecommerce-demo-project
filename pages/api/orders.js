import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Helper function to read JSON file
async function readData(fileName) {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    console.log('Reading file from:', filePath);
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
    console.log('Writing file to:', filePath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    throw error;
  }
}

export default async function handler(req, res) {
  const { method, query } = req;
  console.log('API Request:', { method, query, body: req.body });

  try {
    switch (method) {
      case 'GET':
        console.log('Fetching orders...');
        const data = await readData('orders.json');
        console.log('Orders data:', data);
        const orders = Array.isArray(data) ? data : (data.orders || []);
        res.status(200).json(orders);
        break;

      case 'POST':
        console.log('Creating new order...');
        const existingData = await readData('orders.json');
        const existingOrders = Array.isArray(existingData) ? existingData : (data.orders || []);
        const newOrder = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString(),
        };
        existingOrders.push(newOrder);
        await writeData('orders.json', existingOrders);
        res.status(201).json(newOrder);
        break;

      case 'PUT':
        console.log('Updating order...');
        const { id } = query;
        const updateData = await readData('orders.json');
        const updateOrders = Array.isArray(updateData) ? updateData : (data.orders || []);
        const index = updateOrders.findIndex(order => order.id === id);
        
        if (index === -1) {
          return res.status(404).json({ error: 'Order not found' });
        }
        
        updateOrders[index] = { ...updateOrders[index], ...req.body };
        await writeData('orders.json', updateOrders);
        res.status(200).json(updateOrders[index]);
        break;

      case 'DELETE':
        console.log('Deleting order...');
        const { id: deleteId } = query;
        const deleteData = await readData('orders.json');
        const deleteOrders = Array.isArray(deleteData) ? deleteData : (data.orders || []);
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
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
} 