import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
} from '../controllers/orderController.js';

const router = Router();

// POST /api/orders
router.post('/', createOrder);

// GET /api/orders
router.get('/', getOrders);

// GET /api/orders/:id
router.get('/:id', getOrderById);

export default router;
