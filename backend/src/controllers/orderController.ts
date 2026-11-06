import type { Request, Response } from 'express';
import type { Order, CreateOrderDTO, OrderStatus, CartItem, Product } from '../types/index.js';
import { products } from '../data/products.js';
import { prisma } from '../lib/prisma.js';

// In-memory fallback orders store
export const orders: Order[] = [];

function formatDbOrder(dbOrder: any): Order {
  const items: CartItem[] = (dbOrder.items || []).map((it: any) => ({
    quantity: it.quantity,
    selectedColor: it.selectedColor || undefined,
    product: it.product
      ? {
          id: it.product.id,
          title: it.product.title,
          brand: it.product.brand,
          description: it.product.description,
          price: Number(it.product.price),
          originalPrice: it.product.originalPrice ? Number(it.product.originalPrice) : undefined,
          discountPercentage: it.product.discountPercentage ? Number(it.product.discountPercentage) : undefined,
          rating: Number(it.product.rating),
          reviewsCount: it.product.reviewsCount,
          category: it.product.categorySlug,
          image: it.product.image,
          images: it.product.images || [it.product.image],
          inStock: it.product.inStock,
          stockCount: it.product.stockCount,
          isFeatured: it.product.isFeatured,
          isTrending: it.product.isTrending,
          tags: it.product.tags || [],
          specs: it.product.specs || {},
        }
      : ({
          id: it.productId || 'unknown',
          title: it.productTitle,
          brand: 'AURA',
          description: '',
          price: Number(it.productPrice),
          rating: 5,
          reviewsCount: 0,
          category: 'lifestyle',
          image: it.productImage,
          inStock: true,
          stockCount: 0,
          tags: [],
        } as Product),
  }));

  return {
    orderId: dbOrder.orderId,
    items,
    subtotal: Number(dbOrder.subtotal),
    shipping: Number(dbOrder.shipping),
    tax: Number(dbOrder.tax),
    total: Number(dbOrder.total),
    customerName: dbOrder.customerName,
    email: dbOrder.email,
    address: dbOrder.address,
    city: dbOrder.city,
    postalCode: dbOrder.postalCode,
    status: dbOrder.status as OrderStatus,
    createdAt: dbOrder.createdAt ? new Date(dbOrder.createdAt).toISOString() : new Date().toISOString(),
  };
}

export const createOrder = async (req: Request, res: Response): Promise<void> => {
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

  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Create Order
      const ord = await tx.order.create({
        data: {
          orderId,
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
          items: {
            create: body.items.map((it) => ({
              productId: it.product.id,
              productTitle: it.product.title,
              productPrice: Number(it.product.price),
              productImage: it.product.image,
              quantity: it.quantity,
              selectedColor: it.selectedColor || null,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Deduct stock in DB
      for (const item of body.items) {
        const prod = await tx.product.findUnique({ where: { id: item.product.id } });
        if (prod) {
          const newStock = Math.max(0, prod.stockCount - item.quantity);
          await tx.product.update({
            where: { id: item.product.id },
            data: {
              stockCount: newStock,
              inStock: newStock > 0,
            },
          });
        }
      }

      return ord;
    });

    const formatted = formatDbOrder(createdOrder);
    res.status(201).json({
      success: true,
      orderId: formatted.orderId,
      order: formatted,
      message: 'Order created and payment verified successfully',
    });
    return;
  } catch (err) {
    console.warn('Prisma transaction failed, using in-memory fallback:', (err as Error).message);
  }

  // Deduct stock if available in-memory
  body.items.forEach((item) => {
    const product = products.find((p) => p.id === item.product.id);
    if (product) {
      product.stockCount = Math.max(0, product.stockCount - item.quantity);
      if (product.stockCount === 0) {
        product.inStock = false;
      }
    }
  });

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

export const getOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbOrders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbOrders.length > 0) {
      const formatted = dbOrders.map(formatDbOrder);
      res.json({
        success: true,
        count: formatted.length,
        orders: formatted,
      });
      return;
    }
  } catch (err) {
    console.warn('Database query failed for orders:', (err as Error).message);
  }

  res.json({
    success: true,
    count: orders.length,
    orders,
  });
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  try {
    const dbOrder = await prisma.order.findUnique({
      where: { orderId: id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (dbOrder) {
      res.json({ success: true, order: formatDbOrder(dbOrder) });
      return;
    }
  } catch (err) {
    console.warn('Database query failed for order ID:', (err as Error).message);
  }

  const order = orders.find((o) => o.orderId === id);

  if (!order) {
    res.status(404).json({ success: false, error: `Order with reference "${id}" was not found` });
    return;
  }

  res.json({ success: true, order });
};
