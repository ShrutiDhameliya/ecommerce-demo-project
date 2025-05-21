import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (req.method === 'GET') {
      const orders = await prisma.order.findMany({
        where: {
          userId: userId
        },
        include: {
          items: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json(orders);
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ 
      message: 'Error fetching user orders',
      error: error.message 
    });
  }
} 