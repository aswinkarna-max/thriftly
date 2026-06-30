// server/routes/orderRoutes.js
import express from 'express'
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { protect, sellerOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, placeOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/seller-orders', protect, sellerOnly, getSellerOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id/cancel', protect, cancelOrder)
router.put('/:id/status', protect, sellerOnly, updateOrderStatus)

export default router