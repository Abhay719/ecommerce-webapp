import { Router } from 'express';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import categoryRoutes from './categoryRoutes.js';

const router = Router();

// API Health Check
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'AURA E-Commerce API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mounted Endpoints
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);

export default router;
