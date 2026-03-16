// client/src/components/ProductCard.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const conditionConfig = {
  'new': { label: 'New', color: 'text-emerald-400 bg-emerald-400/10' },
  'like-new': { label: 'Like New', color: 'text-blue-400 bg-blue-400/10' },
  'good': { label: 'Good', color: 'text-yellow-400 bg-yellow-400/10' },
  'fair': { label: 'Fair', color: 'text-orange-400 bg-orange-400/10' },
}

export default function ProductCard({ product, index = 0 }) {
  const [liked, setLiked] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const [imgError, setImgError] = useState(false)
  const condition = conditionConfig[product.condition] || conditionConfig['good']
  const images = product.images || []
  const hasMultiple = images.length > 1

  const prevImg = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextImg = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: '#0f172a',
        border: '0.5px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(52,211,153,0.25)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(52,211,153,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <Link to={`/products/${product._id}`}>
        {/* Image Carousel */}
        <div className="relative h-52 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1e293b,#2d3748)' }}>

          {/* Images */}
          {images.length > 0 && !imgError ? (
            <motion.img
              key={imgIndex}
              src={images[imgIndex].url}
              alt={product.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🛍️</div>
          )}

          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.04) 50%,transparent 60%)' }} />

          {/* Prev / Next buttons — only show if multiple images */}
          {hasMultiple && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '0.5px solid rgba(255,255,255,0.15)' }}
              >
                <FiChevronLeft size={14} className="text-white" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '0.5px solid rgba(255,255,255,0.15)' }}
              >
                <FiChevronRight size={14} className="text-white" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {hasMultiple && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIndex(i) }}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === imgIndex ? '16px' : '5px',
                    height: '5px',
                    background: i === imgIndex ? '#34d399' : 'rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Certified badge */}
          {product.certification?.hasCertification && (
            <div className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(5,150,105,0.85)', color: 'white', backdropFilter: 'blur(4px)', letterSpacing: '0.05em' }}>
              ✓ Certified
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${condition.color}`}>
            {condition.label}
          </span>
          <h3 className="text-sm font-semibold text-gray-100 mt-2 mb-1 truncate">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-3">
            by {product.seller?.shopName || product.seller?.name}
            {product.seller?.isVerifiedSeller && (
              <span className="text-emerald-500 ml-1">✓</span>
            )}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-emerald-400">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
        className="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: liked ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.08)',
        }}
      >
        <FiHeart size={14} className={liked ? 'text-red-400 fill-red-400' : 'text-gray-500'} />
      </button>
    </motion.div>
  )
}