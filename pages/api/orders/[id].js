import fs from 'fs';
import { getServerSession } from 'next-auth/next';
import path from 'path';
import { authOptions } from '../auth/[...nextauth]';

const dataFilePath = path.join(process.cwd(), 'data', 'orders.json');

// Helper function to read orders
const readOrders = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write orders
const writeOrders = (orders) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only admin can update orders
  if (session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const { status } = req.body;
        const orders = readOrders();
        const orderIndex = orders.findIndex(order => order.id === id);

        if (orderIndex === -1) {
          return res.status(404).json({ error: 'Order not found' });
        }

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status.toLowerCase())) {
          return res.status(400).json({ error: 'Invalid status' });
        }

        orders[orderIndex] = {
          ...orders[orderIndex],
          status: status.toLowerCase(),
          updatedAt: new Date().toISOString()
        };

        writeOrders(orders);
        res.status(200).json(orders[orderIndex]);
      } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
      }
      break;

    case 'DELETE':
      try {
        const orders = readOrders();
        const orderIndex = orders.findIndex(order => order.id === id);

        if (orderIndex === -1) {
          return res.status(404).json({ error: 'Order not found' });
        }

        orders.splice(orderIndex, 1);
        writeOrders(orders);
        res.status(200).json({ message: 'Order deleted successfully' });
      } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 