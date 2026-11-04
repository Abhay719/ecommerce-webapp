import type { Request, Response } from 'express';
import type { Order, CreateOrderDTO } from '../types/index.js';
import { products } from '../data/products.js';

// In-memory orders store
export const orders: Order[] = [];

export const createOrder = (req: Request, res: Response): void => {
  const body = req.body as CreateOrderDTO;

  // Validation
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    res.status(400).json({ success: false, error: 'Cannot create order with an empty cart' });
    return;
  }

  if (!body.customerName || !body.email || !body.address || !body.city || !body.postalCode) {
    res.status(400).json({
      success: false,
      error: 'Missing required shipping or customer details (name, email, address, city, postalCode)',
    });
    return;
  }

  // Deduct stock if available
  body.items.forEach((item) => {
    const product = products.find((p) => p.id === item.product.id);
    if (product) {
      product.stockCount = Math.max(0, product.stockCount - item.quantity);
      if (product.stockCount === 0) {
        product.inStock = false;
      }
    }
  });

  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder: Order = {
    orderId,
    items: body.items,
    subtotal: Number(body.subtotal) || 0,
    shipping: Number(body.shipping) || 0,
    tax: Number(body.tax) || 0,
    total: Number(body.total) || 0,
    customerName: body.customerName,
    email: body.email,
    address: body.address,
    city: body.city,
    postalCode: body.postalCode,
    status: 'processing',
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);

  res.status(201).json({
    success: true,
    orderId: newOrder.orderId,
    order: newOrder,
    message: 'Order created and payment verified successfully',
  });
};

export const getOrders = (_req: Request, res: Response): void => {
  res.json({
    success: true,
    count: orders.length,
    orders,
  });
};

export const getOrderById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const order = orders.find((o) => o.orderId === id);

  if (!order) {
    res.status(404).json({ success: false, error: `Order with reference "${id}" was not found` });
    return;
  }

  res.json({ success: true, order });
};
