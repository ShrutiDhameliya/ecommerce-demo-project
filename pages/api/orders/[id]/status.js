import { getServerSession } from "next-auth/next";
import { prisma } from '../../../../lib/prisma';
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);
    console.log('Order ID:', req.query.id);

    const session = await getServerSession(req, res, authOptions);
    console.log('Session:', session);

    if (!session || !session.user) {
      console.log('No session or user found');
      return res.status(401).json({ 
        message: 'Unauthorized - Please log in',
        session: session
      });
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      console.log('User is not admin:', session.user);
      return res.status(403).json({ 
        message: 'Forbidden - Admin access required',
        userRole: session.user.role
      });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    if (req.method === 'PATCH') {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      // Validate status
      const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status',
          validStatuses 
        });
      }

      // Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!existingOrder) {
        console.log('Order not found:', id);
        return res.status(404).json({ message: 'Order not found' });
      }

      console.log('Updating order status:', {
        orderId: id,
        oldStatus: existingOrder.status,
        newStatus: status
      });

      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: true
        }
      });

      console.log('Order status updated successfully:', {
        orderId: id,
        oldStatus: existingOrder.status,
        newStatus: status,
        updatedBy: session.user.email
      });

      return res.status(200).json(updatedOrder);
    } else {
      res.setHeader('Allow', ['PATCH']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in order status update:', error);
    return res.status(500).json({ 
      message: 'Error updating order status',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 