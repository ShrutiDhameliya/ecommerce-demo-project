import fs from 'fs';
import { getServerSession } from 'next-auth/next';
import path from 'path';
import { authOptions } from '../auth/[...nextauth]';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

// Helper function to read products
const readProducts = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write products
const writeProducts = (products) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only admin can manage products
  if (session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const { name, description, price, category, image, stock } = req.body;
        const products = readProducts();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
          return res.status(404).json({ error: 'Product not found' });
        }

        // Validate required fields
        if (!name || !description || !price || !category) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Update product
        products[productIndex] = {
          ...products[productIndex],
          name,
          description,
          price: parseFloat(price),
          category,
          image: image || products[productIndex].image,
          stock: parseInt(stock) || products[productIndex].stock,
          updatedAt: new Date().toISOString()
        };

        writeProducts(products);
        res.status(200).json(products[productIndex]);
      } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
      }
      break;

    case 'DELETE':
      try {
        const products = readProducts();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
          return res.status(404).json({ error: 'Product not found' });
        }

        products.splice(productIndex, 1);
        writeProducts(products);
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 