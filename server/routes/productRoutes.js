// server/routes/productRoutes.js
import express from 'express'
import {
  createProduct,
  getProducts,
  getProductById,
  getMyListings,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} from '../controllers/productController.js'
import { protect, sellerOnly } from '../middleware/authMiddleware.js'
import { uploadProductImages } from '../config/cloudinary.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/my-listings', protect, sellerOnly, getMyListings)
router.get('/:id/related', getRelatedProducts)
router.get('/:id', getProductById)
router.post('/', protect, sellerOnly, uploadProductImages.array('images', 5), createProduct)
router.put('/:id', protect, sellerOnly, updateProduct)
router.delete('/:id', protect, sellerOnly, deleteProduct)

export default router