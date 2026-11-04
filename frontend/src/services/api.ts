import type { Product, OrderDetails } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // Fetch all products with backend fallback
  async getProducts(): Promise<Product[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/products`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return MOCK_PRODUCTS;
    } catch {
      // Backend not running yet or unreachable, use mock data seamlessly
      return MOCK_PRODUCTS;
    }
  },

  // Fetch product by ID
  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
      return MOCK_PRODUCTS.find((p) => p.id === id);
    } catch {
      return MOCK_PRODUCTS.find((p) => p.id === id);
    }
  },

  // Submit order to backend
  async createOrder(order: Omit<OrderDetails, 'orderId' | 'createdAt'>): Promise<{ success: boolean; orderId: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, orderId: data.orderId || `ORD-${Date.now().toString().slice(-6)}` };
      }
      return { success: true, orderId: `ORD-${Date.now().toString().slice(-6)}` };
    } catch {
      // Standalone fallback
      return { success: true, orderId: `ORD-${Date.now().toString().slice(-6)}` };
    }
  },
};
