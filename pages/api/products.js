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
    // Return empty array if file doesn't exist
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
        console.log('Fetching products...');
        const data = await readData('products.json');
        console.log('Products data:', data);
        const products = Array.isArray(data) ? data : (data.products || []);
        res.status(200).json(products);
        break;

      case 'POST':
        console.log('Creating new product...');
        const existingData = await readData('products.json');
        const existingProducts = Array.isArray(existingData) ? existingData : (data.products || []);
        const newProduct = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString(),
        };
        existingProducts.push(newProduct);
        await writeData('products.json', existingProducts);
        res.status(201).json(newProduct);
        break;

      case 'PUT':
        console.log('Updating product...');
        const { id } = query;
        const updateData = await readData('products.json');
        const updateProducts = Array.isArray(updateData) ? updateData : (data.products || []);
        const index = updateProducts.findIndex(product => product.id === id);
        
        if (index === -1) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        updateProducts[index] = { ...updateProducts[index], ...req.body };
        await writeData('products.json', updateProducts);
        res.status(200).json(updateProducts[index]);
        break;

      case 'DELETE':
        console.log('Deleting product...');
        const { id: deleteId } = query;
        const deleteData = await readData('products.json');
        const deleteProducts = Array.isArray(deleteData) ? deleteData : (data.products || []);
        const deleteIndex = deleteProducts.findIndex(product => product.id === deleteId);
        
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        deleteProducts.splice(deleteIndex, 1);
        await writeData('products.json', deleteProducts);
        res.status(200).json({ message: 'Product deleted successfully' });
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