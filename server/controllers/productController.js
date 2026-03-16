// server/controllers/productController.js
import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'
import { cloudinary } from '../config/cloudinary.js'

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, condition, brand, size, tags, hasCertification } = req.body

  if (!req.files || req.files.length === 0) {
    res.status(400)
    throw new Error('Please upload at least one product image')
  }
  const images = req.files.map((file) => ({
    url: file.path || file.secure_url || file.url,
    public_id: file.filename || file.public_id,
  }))

  const product = await Product.create({
    seller: req.user._id,
    name,
    description,
    price: Number(price),
    category,
    condition,
    brand,
    size,
    tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    images,
    certification: {
      hasCertification: hasCertification === 'true',
    },
  })

  res.status(201).json(product)
})

export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, condition, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query

  const query = { isSold: false }

  if (search) query.$text = { $search: search }
  if (category && category !== 'all') query.category = category
  if (condition) query.condition = condition
  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    popular: { views: -1 },
  }

  const sortBy = sortOptions[sort] || sortOptions.newest
  const total = await Product.countDocuments(query)
  const products = await Product.find(query)
    .sort(sortBy)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('seller', 'name shopName isVerifiedSeller avatar')

  res.json({
    products,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    total,
  })
})

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'name shopName isVerifiedSeller avatar createdAt')

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  product.views += 1
  await product.save()

  res.json(product)
})

export const getMyListings = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 })
  res.json(products)
})

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorized to update this listing')
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.json(updated)
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorized to delete this listing')
  }

  for (const img of product.images) {
    await cloudinary.uploader.destroy(img.public_id)
  }

  await product.deleteOne()
  res.json({ message: 'Listing deleted successfully' })
})
// @desc   Get related products
// @route  GET /api/products/:id/related
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isSold: false,
  })
    .limit(4)
    .populate('seller', 'name shopName isVerifiedSeller')

  res.json(related)
})