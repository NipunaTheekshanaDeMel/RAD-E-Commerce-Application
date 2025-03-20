import axios from '../lib/axios';
import { Product, Order } from '../types';

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axios.post('/auth/signIn', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await axios.post('/auth/signUp', { name, email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  getUsers: async () => {
    try {
      const response = await axios.get('/auth/users');
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  }
};

// Product API
export const productApi = {
  getProducts: async () => {
    try {
      const response = await axios.get('/product/products');
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return null;
    }
  },

  getProduct: async (id: string) => {
    try {
      const response = await axios.get(`/product/getSelected/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  createProduct: async (product: Omit<Product, 'id'>) => {
    try {
      const response = await axios.post('/product/add', product);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    try {
      const response = await axios.put(`/product/update/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await axios.delete(`/product/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

// Order API
export const orderApi = {
  getOrders: async (userId?: string) => {
    try {
      const url = userId ? `/order/get?userId=${userId}` : '/order/get';
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return null;
    }
  },

  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    try {
      const response = await axios.post('/order/add', order);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  updateOrderStatus: async (id: string, status: Order['status']) => {
    try {
      const response = await axios.patch(`/order/update/status/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id} status:`, error);
      throw error;
    }
  },
};
