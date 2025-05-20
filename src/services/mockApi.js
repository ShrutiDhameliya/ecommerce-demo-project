import axios from 'axios';

// Use relative path for API calls
const API_URL = '/api';

// User API
export const userApi = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  getByEmail: async (email) => {
    const users = await userApi.getAll();
    return users.find(user => user.email === email);
  },

  create: async (userData) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await axios.put(`${API_URL}/users/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  },

  toggleBlock: async (id) => {
    const user = await userApi.getById(id);
    const response = await axios.put(`${API_URL}/users/${id}`, {
      ...user,
      blocked: !user.blocked,
    });
    return response.data;
  },
};

// Product API
export const productApi = {
  async getAll() {
    try {
      console.log('Making GET request to:', `${API_URL}/products`);
      const response = await axios.get(`${API_URL}/products`);
      console.log('GET products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in productApi.getAll:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to fetch products');
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in productApi.getById:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to fetch product');
    }
  },

  async create(productData) {
    try {
      console.log('Making POST request to:', `${API_URL}/products`, productData);
      const response = await axios.post(`${API_URL}/products`, productData);
      console.log('POST products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in productApi.create:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to create product');
    }
  },

  async update(id, updates) {
    try {
      console.log('Making PUT request to:', `${API_URL}/products/${id}`, updates);
      const response = await axios.put(`${API_URL}/products/${id}`, updates);
      console.log('PUT products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in productApi.update:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to update product');
    }
  },

  async delete(id) {
    try {
      console.log('Making DELETE request to:', `${API_URL}/products/${id}`);
      const response = await axios.delete(`${API_URL}/products/${id}`);
      console.log('DELETE products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in productApi.delete:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to delete product');
    }
  },
};

// Order API
export const orderApi = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  },

  getByUserId: async (userId) => {
    const response = await axios.get(`${API_URL}/orders/user/${userId}`);
    return response.data;
  },

  create: async (order) => {
    const response = await axios.post(`${API_URL}/orders`, order);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await axios.put(`${API_URL}/orders/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/orders/${id}`);
    return response.data;
  },
}; 