// server/models/Product.js
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['sneakers', 'bags', 'watches', 'clothing', 'accessories', 'other'],
    },
    condition: {
      type: String,
      required: true,
      enum: ['new', 'like-new', 'good', 'fair'],
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    // Originality certification
    certification: {
      hasCertification: { type: Boolean, default: false },
      certificateImage: { type: String, default: '' },
      certificatePublicId: { type: String, default: '' },
    },
    brand: {
      type: String,
      default: '',
      trim: true,
    },
    size: {
      type: String,
      default: '',
    },
    tags: [String],
    isSold: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Text index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' })

const Product = mongoose.model('Product', productSchema)
export default Product