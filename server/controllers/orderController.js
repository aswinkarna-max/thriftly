// server/controllers/orderController.js
import asyncHandler from 'express-async-handler'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

// @desc   Place a new order
// @route  POST /api/orders
export const placeOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body

  if (!items || items.length === 0) {
    res.status(400)
    throw new Error('No items in order')
  }

  // Verify all products exist and are not sold
  const productIds = items.map((i) => i.product)
  const products = await Product.find({ _id: { $in: productIds } })

  for (const product of products) {
    if (product.isSold) {
      res.status(400)
      throw new Error(`${product.name} is already sold`)
    }
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingFee = 99
  const total = subtotal + shippingFee

  const order = await Order.create({
    buyer: req.user._id,
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    subtotal,
    shippingFee,
    total,
  })

  // Mark products as sold
  await Product.updateMany(
    { _id: { $in: productIds } },
    { isSold: true }
  )

  const populatedOrder = await Order.findById(order._id)
    .populate('items.product', 'name images')
    .populate('buyer', 'name email')

  res.status(201).json(populatedOrder)
})

// @desc   Get buyer's orders
// @route  GET /api/orders/my-orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name images')

  res.json(orders)
})

// @desc   Get single order
// @route  GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name images price')
    .populate('buyer', 'name email')

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (order.buyer._id.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorized')
  }

  res.json(order)
})

// @desc   Cancel order
// @route  PUT /api/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (order.buyer.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorized')
  }

  if (order.orderStatus !== 'placed') {
    res.status(400)
    throw new Error('Order cannot be cancelled at this stage')
  }

  order.orderStatus = 'cancelled'
  await order.save()

  // Mark products as available again
  const productIds = order.items.map((i) => i.product)
  await Product.updateMany(
    { _id: { $in: productIds } },
    { isSold: false }
  )

  res.json(order)
})

// @desc   Get orders for seller's products
// @route  GET /api/orders/seller-orders
export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'items.seller': req.user._id,
  })
    .sort({ createdAt: -1 })
    .populate('buyer', 'name email')
    .populate('items.product', 'name images')

  res.json(orders)
})

// @desc   Update order status
// @route  PUT /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  // Check if this seller has items in this order
  const hasItems = order.items.some(
    (item) => item.seller.toString() === req.user._id.toString()
  )

  if (!hasItems) {
    res.status(403)
    throw new Error('Not authorized')
  }

  order.orderStatus = orderStatus
  await order.save()

  res.json(order)
})