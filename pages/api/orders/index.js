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

  switch (req.method) {
    case 'GET':
      try {
        const orders = readOrders();
        
        // Filter orders based on user role
        const filteredOrders = session.user.role === 'admin'
          ? orders // Admin sees all orders
          : orders.filter(order => order.userId === session.user.id); // Users see only their orders

        res.status(200).json(filteredOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
      }
      break;

    case 'POST':
      try {
        const { items, total } = req.body;
        const orders = readOrders();

        const newOrder = {
          id: Date.now().toString(),
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          items,
          total,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        writeOrders(orders);

        res.status(201).json(newOrder);
      } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 